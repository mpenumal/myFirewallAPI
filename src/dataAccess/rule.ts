import * as elasticsearch from 'elasticsearch';
import { Router } from 'express';
import { ruleListRouter } from '../routes/ruleList';

class ElasticClient {
  static client: elasticsearch.Client = ElasticClient.elasticClient();
  static elasticClient() {
    return new elasticsearch.Client({
      hosts: 'localhost:9200',
      log: 'error'
    });
  }
}

export async function deleteIndex(index: string) {
  try {
    await ElasticClient.client.indices.delete({ index });
  } catch (e) {
    return e;
  }
}

async function createIndex(index: string) {
  try {
    await ElasticClient.client.indices.create({ index });
  } catch (e) {
    return e;
  }
}

async function checkIfIndexDA(index: string) {
  try {
    await ElasticClient.client.indices.exists({ index });
  } catch {
    try {
      await createIndex(index);
    } catch (e) {
      return e;
    }
  }
}

export async function getRuleDA(id: number) {
  try {
    const result = await ElasticClient.client.search({
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
      ? result.hits.hits[0]._source as Rule
      : null;
  } catch (e) {
    throw new Error(`Cannot get the requested Rule. ${e}`);
  }
}

export async function addRuleDA(rule: Rule) {
  try {
    const result = await ElasticClient.client.index({
      index: 'rule',
      type: 'doc',
      body: rule
    });
    return `Add Rule - Success.`;
  } catch (e) {
    throw new Error(`Cannot add Rule. ${e}`);
  }
}

export async function updateRuleDA(id: number, rule: Rule) {
  try {
    const result = await ElasticClient.client.updateByQuery({
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
  } catch (e) {
    throw new Error(`Cannot update Rule. ${e}`);
  }
}

export async function deleteRuleDA(id: number) {
  try {
    const result = await ElasticClient.client.deleteByQuery({
      index: 'rule',
      type: 'doc',
      body: {
        query: { match: { id } }
      }
    });
    return `Delete Rule - Success.`;
  } catch (e) {
    throw new Error(`Cannot delete Rule. ${e}`);
  }
}