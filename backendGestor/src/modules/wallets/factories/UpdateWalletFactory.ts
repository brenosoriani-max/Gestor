import { Request, Response } from 'express';
import { PrismaWalletsRepository } from '../../../repositories/prisma/prismaWalletsRepository';
import { UpdateWalletController } from '../controllers/UpdateWalletController';
import { UpdateWalletService } from '../services/UpdateWalletService';

export const updateWalletFactory = async (req: Request, res: Response) => {
  const controller = new UpdateWalletController(new UpdateWalletService(new PrismaWalletsRepository()));
  await controller.handle(req, res);
};
