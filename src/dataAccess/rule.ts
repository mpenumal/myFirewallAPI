import { Router } from 'express';
import { ElasticClient } from './ElasticClient';
import { ruleConfig } from './configDA';
import { Rule } from '../model/rule';

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
      ...ruleConfig,
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

export async function getRulesCollectionDA(ruleIds: number[]) {
  try {
    const query = ruleIds.map((x) => `id:${x} or `).join().replace(',', '').slice(0, -4);
    const results = await ElasticClient.client.msearch({
      body: [
        { ...ruleConfig },
        { query: { query_string: { query } } }
      ]
    });
    return results.responses !== undefined
      ? results.responses.map((responses) => responses.hits.hits.map((x) => x._source as Rule))[0]
      : null;
  } catch (e) {
    throw new Error(`Cannot get the requested Rules.${e}`);
  }
}

export async function addRuleDA(rule: Rule) {
  try {
    const result = await ElasticClient.client.index({
      ...ruleConfig,
      body: rule
    });
    return `Add Rule - Success.`;
  } catch (e) {
    throw new Error(`Cannot add Rule.${e}`);
  }
}

export async function updateRuleDA(id: number, rule: Rule) {
  try {
    const result = await ElasticClient.client.updateByQuery({
      ...ruleConfig,
      body: {
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
      }
    });
    return `Update Rule - Success.`;
  } catch (e) {
    throw new Error(`Cannot update Rule.${e}`);
  }
}

export async function deleteRuleDA(id: number) {
  try {
    const result = await ElasticClient.client.deleteByQuery({
      ...ruleConfig,
      body: {
        query: { match: { id } }
      }
    });
    return `Delete Rule - Success.`;
  } catch (e) {
    throw new Error(`Cannot delete Rule.${e}`);
  }
}