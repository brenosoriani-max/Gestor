import { Wallets } from '../../../generated/prisma';
import { walletsRepository } from '../../../repositories/walletsRepository';

export class ListWalletsByUserService {
  constructor(private walletRepo: walletsRepository) {}

  async execute(idUser: string): Promise<Wallets[]> {
    return this.walletRepo.findByUser(idUser);
  }
}
