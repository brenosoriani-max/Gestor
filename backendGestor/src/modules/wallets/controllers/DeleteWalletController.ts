import { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { DeleteWalletService } from '../services/DeleteWalletService';

export class DeleteWalletController {
  constructor(private deleteWalletService: DeleteWalletService) {}

  async handle(req: Request, res: Response) {
    try {
      const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
      await this.deleteWalletService.execute(id);
      return res.status(204).send();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: 'Identificador de carteira inválido', error: error.issues });
      }
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
}
