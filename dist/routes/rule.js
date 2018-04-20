"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const rule_1 = require("../dataAccess/rule");
function runOperation(target, property, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield originalMethod(req, res);
                res.json(result);
            }
            catch (e) {
                throw new Error(e);
            }
        });
    };
}
class RuleRoutes {
    static getRule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const rule = yield rule_1.getRuleDA(req.params.id);
            return rule;
        });
    }
    static addRule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield rule_1.addRuleDA(req.body);
            return result;
        });
    }
    static updateRule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield rule_1.updateRuleDA(req.params.id, req.body);
            return result;
        });
    }
    static deleteRule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield rule_1.deleteRuleDA(req.params.id);
            return result;
        });
    }
}
__decorate([
    runOperation
], RuleRoutes, "getRule", null);
__decorate([
    runOperation
], RuleRoutes, "addRule", null);
__decorate([
    runOperation
], RuleRoutes, "updateRule", null);
__decorate([
    runOperation
], RuleRoutes, "deleteRule", null);
exports.ruleRouter = express_1.Router();
exports.ruleRouter.get('/:id', RuleRoutes.getRule);
exports.ruleRouter.post('/', RuleRoutes.addRule);
exports.ruleRouter.put('/:id', RuleRoutes.updateRule);
exports.ruleRouter.delete('/:id', RuleRoutes.deleteRule);
