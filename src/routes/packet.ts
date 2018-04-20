import { Router, Request, Response, NextFunction } from 'express';

function isPacketAllowed(req: Request, res: Response) {
}

export const packetRouter = Router();
packetRouter.post('/', isPacketAllowed);