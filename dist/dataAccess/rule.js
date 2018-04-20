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
const elasticsearch = require("elasticsearch");
class ElasticClient {
    static elasticClient() {
        return new elasticsearch.Client({
            hosts: 'localhost:9200',
            log: 'error'
        });
    }
}
ElasticClient.client = ElasticClient.elasticClient();
function deleteIndex(index) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield ElasticClient.client.indices.delete({ index });
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
            yield ElasticClient.client.indices.create({ index });
        }
        catch (e) {
            return e;
        }
    });
}
function checkIfIndexDA(index) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield ElasticClient.client.indices.exists({ index });
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
            const result = yield ElasticClient.client.search({
                index: 'rule',
                type: 'doc',
                body: {
                    query: {
                        match: {
                            id
                        }
                    }
                }
            });
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
function addRuleDA(rule) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield ElasticClient.client.index({
                index: 'rule',
                type: 'doc',
                body: rule
            });
            return `Add Rule - Success.`;
        }
        catch (e) {
            throw new Error(`Cannot add Rule. ${e}`);
        }
    });
}
exports.addRuleDA = addRuleDA;
function updateRuleDA(id, rule) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield ElasticClient.client.updateByQuery({
                index: 'rule',
                type: 'doc',
                body: {
                    query: { match: { id } },
                    script: `
        ctx._source.id = '${rule.id}';
        ctx._source.sourceIP = '${rule.sourceIP}';
        ctx._source.destinationIP = '${rule.destinationIP}';
        ctx._source.id = '${rule.sourcePort}';
        ctx._source.id = '${rule.destinationPort}';
        ctx._source.id = '${rule.type}';
        ctx._source.id = '${rule.packetsPerSecond}';
        ctx._source.id = '${rule.action}';
        `
                }
            });
            return `Update Rule - Success.`;
        }
        catch (e) {
            throw new Error(`Cannot update Rule. ${e}`);
        }
    });
}
exports.updateRuleDA = updateRuleDA;
function deleteRuleDA(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield ElasticClient.client.deleteByQuery({
                index: 'rule',
                type: 'doc',
                body: {
                    query: { match: { id } }
                }
            });
            return `Delete Rule - Success.`;
        }
        catch (e) {
            throw new Error(`Cannot delete Rule. ${e}`);
        }
    });
}
exports.deleteRuleDA = deleteRuleDA;
