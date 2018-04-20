import { Router, Request, Response, NextFunction } from 'express';
import { getRuleDA, addRuleDA, updateRuleDA, deleteRuleDA, deleteIndex } from '../dataAccess/rule';

function runOperation(target: RuleRoutes, property: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = async function (req: Request, res: Response) {
    try {
      const result = await originalMethod(req, res);
      res.json(result);
    } catch (e) {
      throw new Error(e);
    }
  }
}

class RuleRoutes {
  @runOperation
  static async getRule(req: Request, res: Response) {
    const rule = await getRuleDA(req.params.id);
    return rule;
  }

  @runOperation
  static async addRule(req: Request, res: Response) {
    const result = await addRuleDA(req.body);
    return result;
  }

  @runOperation
  static async updateRule(req: Request, res: Response) {
    const result = await updateRuleDA(req.params.id, req.body);
    return result;
  }

  @runOperation
  static async deleteRule(req: Request, res: Response) {
    const result = await deleteRuleDA(req.params.id);
    return result;
  }
}

export const ruleRouter = Router();
ruleRouter.get('/:id', RuleRoutes.getRule);
ruleRouter.post('/', RuleRoutes.addRule);
ruleRouter.put('/:id', RuleRoutes.updateRule);
ruleRouter.delete('/:id', RuleRoutes.deleteRule);