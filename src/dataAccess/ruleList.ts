import { Router } from 'express';
import { ElasticClient } from './elasticClient';
import { ruleListConfig } from './configDA';

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

export async function getRuleListDA(id: number) {
  try {
    const result = await ElasticClient.client.search({
      ...ruleListConfig,
      body: {
        query: {
          match: {
            id
          }
        }
      }
    });

    return result.hits.hits.length > 0
      ? result.hits.hits[0]._source as RuleList
      : null;
  } catch (e) {
    throw new Error(`Cannot get the requested Rule. ${e}`);
  }
}

export async function addRuleListDA(ruleList: RuleList) {
  try {
    const result = await ElasticClient.client.index({
      ...ruleListConfig,
      body: ruleList
    });
    return `Add Rule - Success.`;
  } catch (e) {
    throw new Error(`Cannot add Rule. ${e}`);
  }
}

export async function updateRuleListDA(id: number, ruleList: RuleList) {
  try {
    const result = await ElasticClient.client.updateByQuery({
      ...ruleListConfig,
      body: {
        query: { match: { id } },
        script: `
        ctx._source.id = '${ruleList.id}';
        ctx._source.rules = '${ruleList.rules}';
        `
      }
    });
    return `Update Rule - Success.`;
  } catch (e) {
    throw new Error(`Cannot update Rule. ${e}`);
  }
}

export async function deleteRuleListDA(id: number) {
  try {
    const result = await ElasticClient.client.deleteByQuery({
      ...ruleListConfig,
      body: {
        query: { match: { id } }
      }
    });
    return `Delete Rule - Success.`;
  } catch (e) {
    throw new Error(`Cannot delete Rule. ${e}`);
  }
}