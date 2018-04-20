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
const ruleList_1 = require("../dataAccess/ruleList");
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
class RuleListRoutes {
    static getRuleList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ruleList = yield ruleList_1.getRuleListDA(req.params.id);
            return ruleList;
        });
    }
    static addRuleList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield ruleList_1.addRuleListDA(req.body);
            return result;
        });
    }
    static updateRuleList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield ruleList_1.updateRuleListDA(req.params.id, req.body);
            return result;
        });
    }
    static deleteRuleList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield ruleList_1.deleteRuleListDA(req.params.id);
            return result;
        });
    }
}
__decorate([
    runOperation
], RuleListRoutes, "getRuleList", null);
__decorate([
    runOperation
], RuleListRoutes, "addRuleList", null);
__decorate([
    runOperation
], RuleListRoutes, "updateRuleList", null);
__decorate([
    runOperation
], RuleListRoutes, "deleteRuleList", null);
exports.ruleListRouter = express_1.Router();
exports.ruleListRouter.get('/:id', RuleListRoutes.getRuleList);
exports.ruleListRouter.post('/', RuleListRoutes.addRuleList);
exports.ruleListRouter.put('/:id', RuleListRoutes.updateRuleList);
exports.ruleListRouter.delete('/:id', RuleListRoutes.deleteRuleList);
