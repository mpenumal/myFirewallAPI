import { Router, Request, Response, NextFunction } from 'express';

class RuleListRoutes {
  static getRuleList(req: Request, res: Response) {
  }

  static addRuleList(req: Request, res: Response) {
  }

  static updateRuleList(req: Request, res: Response) {
  }

  static deleteRuleList(req: Request, res: Response) {
  }
}

export const ruleListRouter = Router();
ruleListRouter.get('/:id', RuleListRoutes.getRuleList);
ruleListRouter.post('/', RuleListRoutes.addRuleList);
ruleListRouter.put('/:id', RuleListRoutes.updateRuleList);
ruleListRouter.delete('/:id', RuleListRoutes.deleteRuleList);