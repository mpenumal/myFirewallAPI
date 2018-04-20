"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class RuleListRoutes {
    static getRuleList(req, res) {
    }
    static addRuleList(req, res) {
    }
    static updateRuleList(req, res) {
    }
    static deleteRuleList(req, res) {
    }
}
exports.ruleListRouter = express_1.Router();
exports.ruleListRouter.get('/:id', RuleListRoutes.getRuleList);
exports.ruleListRouter.post('/', RuleListRoutes.addRuleList);
exports.ruleListRouter.put('/:id', RuleListRoutes.updateRuleList);
exports.ruleListRouter.delete('/:id', RuleListRoutes.deleteRuleList);
