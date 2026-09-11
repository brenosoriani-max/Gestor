import { prisma } from '../../db/prisma';
import { Role, Users } from '../../generated/prisma';
import { usersRepository } from '../usersRepository';

export class PrismaUserRepository implements usersRepository {
  async create(
    email: string,
    password: string,
    name: string,
    role: Role
  ): Promise<Users> {
    return await prisma.users.create({
      data: {
        email,
        password,
        name,
        role,
      },
    });
  }
  async findById(id: string): Promise<Users | null> {
    const user = await prisma.users.findUnique({
      where: {
        id,
      },
    });
    return user;
  }
  async findByEmail(email: string): Promise<Users | null> {
    const user = await prisma.users.findUnique({
      where: { email },
    });
    return user;
  }
  async findAll(): Promise<Users[]> {
    const users = await prisma.users.findMany();
    return users;
  }


  async updatePassword(id: string, password: string): Promise<Users> {
  return await prisma.users.update({
    where: { id },
    data: { password },
  });
}

  async update(id: string, email: string, password: string): Promise<Users> {
    const user = await prisma.users.update({
      where: {
        id,
      },
      data: {
        email,
        password,
      },
    });
    return user;
  }
  async delete(id: string): Promise<void> {
    await prisma.users.delete({
      where: {
        id,
      },
    });
  }
}
