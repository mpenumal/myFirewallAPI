import { Router, Request, Response, NextFunction } from 'express';
import { applicableRulesConfig } from '../dataAccess/configDA';
import { getRuleListDA } from '../dataAccess/ruleList';
import { getRulesCollectionDA } from '../dataAccess/rule';
import { Action } from '../model/action';
import { Rule } from '../model/rule';

async function packetControl(req: Request, res: Response) {
  const packet: Packet = req.body;
  let ruleList: RuleList | null;
  let rules: Rule[] | null;
  try {
    ruleList = await getRuleListDA(getApplicableRuleListID());
  } catch (e) {
    throw new Error(`Firewall ruleList check failed. ${e}`);
  }
  try {
    rules = ruleList && await getRulesCollectionDA(ruleList.rules);
  } catch (e) {
    throw new Error(`Firewall rule check failed. ${e}`);
  }
  const response = determinePacketAction(packet, rules);
  res.send(response.toString());
}

const ipCountForRule: { id: number, ip: number, count: number, time: number }[]
  = [{ id: 0, ip: 0, count: 0, time: 0 }];

// pick id based on time.
function getApplicableRuleListID() {
  return applicableRulesConfig[0].ruleListID;
}

function determinePacketAction(packet: Packet, rules: Rule[] | null) {
  if (rules === null || rules === undefined) {
    return Action.allow;
  } else {
    const matchedRules = rules
      .filter((x) => !x.sourceIP || x.sourceIP === packet.sourceIP)
      .filter((x) => !x.destinationIP || x.destinationIP === packet.destinationIP)
      .filter((x) => !x.sourcePort || x.sourcePort === packet.sourcePort)
      .filter((x) => !x.destinationPort || x.destinationPort === packet.destinationPort)
      .filter((x) => !x.type || x.type === packet.type);

    return matchedRules && matchedRules[0] && matchedRules[0] !== undefined
      ? matchedRules[0].action === Action.checkRate
        ? checkPacketRate(packet, matchedRules[0])
        : matchedRules[0].action
      : Action.allow;
  }
}

function checkPacketRate(packet: Packet, rule: Rule) {
  let actionToDo = Action.allow;
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
      } else if (x.count > rule.packetsPerSecond) {
        actionToDo = Action.deny;
      } else {
        x.count += 1;
      }
      return x;
    });

  return actionToDo;
}

export const packetRouter = Router();
packetRouter.post('/', packetControl);