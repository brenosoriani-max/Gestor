import { Request, Response } from 'express';
import { PrismaWalletsRepository } from '../../../repositories/prisma/prismaWalletsRepository';
import { CreateWalletController } from '../controllers/CreateWalletController';
import { CreateWalletService } from '../services/CreateWalletService';

export const createWalletFactory = async (req: Request, res: Response) => {
  const controller = new CreateWalletController(new CreateWalletService(new PrismaWalletsRepository()));
  await controller.handle(req, res);
};
