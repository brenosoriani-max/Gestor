import { prisma } from '../../db/prisma';
import { Wallets } from '../../generated/prisma';
import { WalletDTO, walletsRepository } from '../walletsRepository';

export class PrismaWalletsRepository implements walletsRepository {
  async create(data: WalletDTO): Promise<Wallets> {
    return prisma.wallets.create({ data });
  }

  async findByUser(idUser: string): Promise<Wallets[]> {
    return prisma.wallets.findMany({ where: { idUser }, orderBy: { createdAt: 'desc' } });
  }

  async update(id: string, data: Partial<WalletDTO>): Promise<Wallets> {
    return prisma.wallets.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.wallets.delete({ where: { id } });
  }
}
