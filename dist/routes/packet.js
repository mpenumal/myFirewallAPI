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
function packetControl(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const packet = req.body;
        // get RuleList of the applicable ID.
        // get the rules associated.
        // check packet.
        // return Action.
        try {
            const ruleList = yield ruleList_1.getRuleListDA(getApplicableRuleList());
            try {
                const rules = ruleList && (yield rule_1.getRulesCollectionDA(ruleList.rules));
                const response = checkPacketAction(packet, rules);
                res.send(rules);
            }
            catch (e) {
                throw new Error(`Firewall rule check failed. ${e}`);
            }
        }
        catch (e) {
            throw new Error(`Firewall ruleList check failed. ${e}`);
        }
    });
}
// pick id based on time.
function getApplicableRuleList() {
    return configDA_1.applicableRulesConfig[0].ruleListID;
}
function checkPacketAction(packet, rules) {
    if (rules === null) {
        return Action.allow;
    }
    else {
    }
}
exports.packetRouter = express_1.Router();
exports.packetRouter.post('/', packetControl);
