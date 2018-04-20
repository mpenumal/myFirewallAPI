import { Router, Request, Response, NextFunction } from 'express';
import { getRuleListDA, addRuleListDA, updateRuleListDA, deleteRuleListDA, deleteIndex } from '../dataAccess/ruleList';

function runOperation(target: RuleListRoutes, property: string, descriptor: PropertyDescriptor) {
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

class RuleListRoutes {
  @runOperation
  static async getRuleList(req: Request, res: Response) {
    const ruleList = await getRuleListDA(req.params.id);
    return ruleList;
  }

  @runOperation
  static async addRuleList(req: Request, res: Response) {
    const result = await addRuleListDA(req.body);
    return result;
  }

  @runOperation
  static async updateRuleList(req: Request, res: Response) {
    const result = await updateRuleListDA(req.params.id, req.body);
    return result;
  }

  @runOperation
  static async deleteRuleList(req: Request, res: Response) {
    const result = await deleteRuleListDA(req.params.id);
    return result;
  }
}

export const ruleListRouter = Router();
ruleListRouter.get('/:id', RuleListRoutes.getRuleList);
ruleListRouter.post('/', RuleListRoutes.addRuleList);
ruleListRouter.put('/:id', RuleListRoutes.updateRuleList);
ruleListRouter.delete('/:id', RuleListRoutes.deleteRuleList);