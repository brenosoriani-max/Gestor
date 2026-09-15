import { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { CreateWalletService } from '../services/CreateWalletService';

export class CreateWalletController {
  constructor(private createWalletService: CreateWalletService) {}

  async handle(req: Request, res: Response) {
    try {
      const data = z.object({
        name: z.string().trim().min(1).max(100),
        balance: z.number().finite(),
        idUser: z.string().uuid(),
      }).parse(req.body);

      const wallet = await this.createWalletService.execute(data);
      return res.status(201).json({ wallet });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: 'Erro nos campos enviados', error: error.issues });
      }
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
}
