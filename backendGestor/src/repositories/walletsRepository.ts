import { Wallets } from '../generated/prisma';

export interface WalletDTO {
  name: string;
  balance: number;
  idUser: string;
}

export interface walletsRepository {
  create(data: WalletDTO): Promise<Wallets>;
  findByUser(idUser: string): Promise<Wallets[]>;
  update(id: string, data: Partial<WalletDTO>): Promise<Wallets>;
  delete(id: string): Promise<void>;
}
