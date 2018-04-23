"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const configDA_1 = require("../dataAccess/configDA");
const ruleList_1 = require("../dataAccess/ruleList");
const rule_1 = require("../dataAccess/rule");
const action_1 = require("../model/action");
function packetControl(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const packet = req.body;
        let ruleList;
        let rules;
        try {
            ruleList = yield ruleList_1.getRuleListDA(getApplicableRuleListID());
        }
        catch (e) {
            throw new Error(`Firewall ruleList check failed. ${e}`);
        }
        try {
            rules = ruleList && (yield rule_1.getRulesCollectionDA(ruleList.rules));
        }
        catch (e) {
            throw new Error(`Firewall rule check failed. ${e}`);
        }
        const response = determinePacketAction(packet, rules);
        res.send(response.toString());
    });
}
const ipCountForRule = [{ id: 0, ip: 0, count: 0, time: 0 }];
// pick id based on time.
function getApplicableRuleListID() {
    return configDA_1.applicableRulesConfig[0].ruleListID;
}
function determinePacketAction(packet, rules) {
    if (rules === null || rules === undefined) {
        return action_1.Action.allow;
    }
    else {
        const matchedRules = rules
            .filter((x) => !x.sourceIP || x.sourceIP === packet.sourceIP)
            .filter((x) => !x.destinationIP || x.destinationIP === packet.destinationIP)
            .filter((x) => !x.sourcePort || x.sourcePort === packet.sourcePort)
            .filter((x) => !x.destinationPort || x.destinationPort === packet.destinationPort)
            .filter((x) => !x.type || x.type === packet.type);
        return matchedRules && matchedRules[0] && matchedRules[0] !== undefined
            ? matchedRules[0].action === action_1.Action.checkRate
                ? checkPacketRate(packet, matchedRules[0])
                : matchedRules[0].action
            : action_1.Action.allow;
    }
}
function checkPacketRate(packet, rule) {
    let actionToDo = action_1.Action.allow;
    const currentTime = (new Date().getTime() / 1000) % 10;
    if (ipCountForRule === undefined
        || ipCountForRule.find((result1) => result1.id === rule.id) === undefined
        || ipCountForRule.find((result1) => result1.ip === packet.sourceIP) === undefined) {
        ipCountForRule.push({ id: rule.id, ip: packet.sourceIP, count: 1, time: currentTime });
    }
    ipCountForRule
        .filter((result1) => result1.id === rule.id)
        .filter((result2) => result2.ip === packet.sourceIP)
        .map(function (x) {
        if (currentTime !== x.time) {
            x.time = currentTime;
            x.count = 1;
        }
        else if (x.count > rule.packetsPerSecond) {
            actionToDo = action_1.Action.deny;
        }
        else {
            x.count += 1;
        }
        return x;
    });
    return actionToDo;
}
exports.packetRouter = express_1.Router();
exports.packetRouter.post('/', packetControl);
