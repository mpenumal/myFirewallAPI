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
const elasticClient_1 = require("./elasticClient");
const configDA_1 = require("./configDA");
function deleteIndex(index) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield elasticClient_1.ElasticClient.client.indices.delete({ index });
        }
        catch (e) {
            return e;
        }
    });
}
exports.deleteIndex = deleteIndex;
function createIndex(index) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield elasticClient_1.ElasticClient.client.indices.create({ index });
        }
        catch (e) {
            return e;
        }
    });
}
function checkIfIndexDA(index) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield elasticClient_1.ElasticClient.client.indices.exists({ index });
        }
        catch (_a) {
            try {
                yield createIndex(index);
            }
            catch (e) {
                return e;
            }
        }
    });
}
function getRuleListDA(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield elasticClient_1.ElasticClient.client.search(Object.assign({}, configDA_1.ruleListConfig, { body: {
                    query: {
                        match: {
                            id
                        }
                    }
                } }));
            return result.hits.hits.length > 0
                ? result.hits.hits[0]._source
                : null;
        }
        catch (e) {
            throw new Error(`Cannot get the requested Rule. ${e}`);
        }
    });
}
exports.getRuleListDA = getRuleListDA;
function addRuleListDA(ruleList) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield elasticClient_1.ElasticClient.client.index(Object.assign({}, configDA_1.ruleListConfig, { body: ruleList }));
            return `Add RuleList - Success.`;
        }
        catch (e) {
            throw new Error(`Cannot add RuleList. ${e}`);
        }
    });
}
exports.addRuleListDA = addRuleListDA;
function updateRuleListDA(id, ruleList) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield elasticClient_1.ElasticClient.client.updateByQuery(Object.assign({}, configDA_1.ruleListConfig, { body: {
                    query: { match: { id } },
                    script: `
        ctx._source.id = '${ruleList.id}';
        ctx._source.rules = '${ruleList.rules}';
        `
                } }));
            return `Update RuleList - Success.`;
        }
        catch (e) {
            throw new Error(`Cannot update RuleList. ${e}`);
        }
    });
}
exports.updateRuleListDA = updateRuleListDA;
function deleteRuleListDA(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield elasticClient_1.ElasticClient.client.deleteByQuery(Object.assign({}, configDA_1.ruleListConfig, { body: {
                    query: { match: { id } }
                } }));
            return `Delete RuleList - Success.`;
        }
        catch (e) {
            throw new Error(`Cannot delete RuleList. ${e}`);
        }
    });
}
exports.deleteRuleListDA = deleteRuleListDA;
