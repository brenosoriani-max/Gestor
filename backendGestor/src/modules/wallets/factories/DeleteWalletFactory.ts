import { Request, Response } from 'express';
import { PrismaWalletsRepository } from '../../../repositories/prisma/prismaWalletsRepository';
import { DeleteWalletController } from '../controllers/DeleteWalletController';
import { DeleteWalletService } from '../services/DeleteWalletService';

export const deleteWalletFactory = async (req: Request, res: Response) => {
  const controller = new DeleteWalletController(new DeleteWalletService(new PrismaWalletsRepository()));
  await controller.handle(req, res);
};
