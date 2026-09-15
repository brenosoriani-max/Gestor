import { Wallets } from '../../../generated/prisma';
import { WalletDTO, walletsRepository } from '../../../repositories/walletsRepository';

export class CreateWalletService {
  constructor(private walletRepo: walletsRepository) {}

  async execute(data: WalletDTO): Promise<Wallets> {
    return this.walletRepo.create(data);
  }
}
