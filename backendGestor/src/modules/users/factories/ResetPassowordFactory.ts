import { Request, Response } from 'express';

import { PrismaUserRepository } from '../../../repositories/prisma/prismaUserRepository';
import { ResetPasswordService } from '../services/ResetPasswordService';
import { ResetPasswordController } from '../controllers/ResetPasswordController';

export const resetPassowrdFactory = async (req: Request, res: Response) => {
  try {
    const prismaUserRepository = new PrismaUserRepository();
    const Service = new ResetPasswordService(prismaUserRepository);
    const Controller = new ResetPasswordController(Service);

    await Controller.handle(req, res);
  } catch (error: any) {
    return res.status(error?.statusCode || 400).json(error);
  }
};
