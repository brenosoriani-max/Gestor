import { Wallets } from '../../../generated/prisma';
import { WalletDTO, walletsRepository } from '../../../repositories/walletsRepository';

export class UpdateWalletService {
  constructor(private walletRepo: walletsRepository) {}

  async execute(id: string, data: Partial<WalletDTO>): Promise<Wallets> {
    return this.walletRepo.update(id, data);
  }
}
