import { walletsRepository } from '../../../repositories/walletsRepository';

export class DeleteWalletService {
  constructor(private walletRepo: walletsRepository) {}

  async execute(id: string): Promise<void> {
    return this.walletRepo.delete(id);
  }
}
