import { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { ListWalletsByUserService } from '../services/ListWalletsByUserService';

export class ListWalletsByUserController {
  constructor(private listWalletsByUserService: ListWalletsByUserService) {}

  async handle(req: Request, res: Response) {
    try {
      const { idUser } = z.object({ idUser: z.string().uuid() }).parse(req.params);
      const wallets = await this.listWalletsByUserService.execute(idUser);
      return res.json({ wallets });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: 'Identificador de usuário inválido', error: error.issues });
      }
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
}
