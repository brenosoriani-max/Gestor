import { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { UpdateWalletService } from '../services/UpdateWalletService';

export class UpdateWalletController {
  constructor(private updateWalletService: UpdateWalletService) {}

  async handle(req: Request, res: Response) {
    try {
      const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
      const data = z.object({
        name: z.string().trim().min(1).max(100).optional(),
        balance: z.number().finite().optional(),
      }).refine((value) => Object.keys(value).length > 0).parse(req.body);
      const wallet = await this.updateWalletService.execute(id, data);
      return res.json({ wallet });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: 'Erro nos campos enviados', error: error.issues });
      }
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
}
