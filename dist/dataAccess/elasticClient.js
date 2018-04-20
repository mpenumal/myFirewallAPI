"use strict";
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
exports.ElasticClient = ElasticClient;
