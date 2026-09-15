import { Request, Response } from 'express';
import { PrismaWalletsRepository } from '../../../repositories/prisma/prismaWalletsRepository';
import { ListWalletsByUserController } from '../controllers/ListWalletsByUserController';
import { ListWalletsByUserService } from '../services/ListWalletsByUserService';

export const listWalletsByUserFactory = async (req: Request, res: Response) => {
  const controller = new ListWalletsByUserController(new ListWalletsByUserService(new PrismaWalletsRepository()));
  await controller.handle(req, res);
};
