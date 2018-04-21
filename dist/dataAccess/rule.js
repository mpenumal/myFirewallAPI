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
const ElasticClient_1 = require("./ElasticClient");
const configDA_1 = require("./configDA");
function deleteIndex(index) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield ElasticClient_1.ElasticClient.client.indices.delete({ index });
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
            yield ElasticClient_1.ElasticClient.client.indices.create({ index });
        }
        catch (e) {
            return e;
        }
    });
}
function checkIfIndexDA(index) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield ElasticClient_1.ElasticClient.client.indices.exists({ index });
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
function getRuleDA(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield ElasticClient_1.ElasticClient.client.search(Object.assign({}, configDA_1.ruleConfig, { body: {
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
exports.getRuleDA = getRuleDA;
function getRulesCollectionDA(ruleIds) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = ruleIds.map((x) => `id:${x} or `).join().replace(',', '').slice(0, -4);
            const results = yield ElasticClient_1.ElasticClient.client.msearch({
                body: [
                    Object.assign({}, configDA_1.ruleConfig),
                    { query: { query_string: { query } } }
                ]
            });
            return results.responses !== undefined
                ? results.responses.map((responses) => responses.hits.hits.map((x) => x._source))[0]
                : null;
        }
        catch (e) {
            throw new Error(`Cannot get the requested Rules.${e}`);
        }
    });
}
exports.getRulesCollectionDA = getRulesCollectionDA;
function addRuleDA(rule) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield ElasticClient_1.ElasticClient.client.index(Object.assign({}, configDA_1.ruleConfig, { body: rule }));
            return `Add Rule - Success.`;
        }
        catch (e) {
            throw new Error(`Cannot add Rule.${e}`);
        }
    });
}
exports.addRuleDA = addRuleDA;
function updateRuleDA(id, rule) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield ElasticClient_1.ElasticClient.client.updateByQuery(Object.assign({}, configDA_1.ruleConfig, { body: {
                    query: { match: { id } },
                    script: `
        ctx._source.id = '${rule.id}';
      ctx._source.sourceIP = '${rule.sourceIP}';
      ctx._source.destinationIP = '${rule.destinationIP}';
      ctx._source.sourcePort = '${rule.sourcePort}';
      ctx._source.destinationPort = '${rule.destinationPort}';
      ctx._source.type = '${rule.type}';
      ctx._source.packetsPerSecond = '${rule.packetsPerSecond}';
      ctx._source.action = '${rule.action}';
        `
                } }));
            return `Update Rule - Success.`;
        }
        catch (e) {
            throw new Error(`Cannot update Rule.${e}`);
        }
    });
}
exports.updateRuleDA = updateRuleDA;
function deleteRuleDA(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield ElasticClient_1.ElasticClient.client.deleteByQuery(Object.assign({}, configDA_1.ruleConfig, { body: {
                    query: { match: { id } }
                } }));
            return `Delete Rule - Success.`;
        }
        catch (e) {
            throw new Error(`Cannot delete Rule.${e}`);
        }
    });
}
exports.deleteRuleDA = deleteRuleDA;
