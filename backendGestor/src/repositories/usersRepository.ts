import { Role, Users } from '../generated/prisma';

export interface usersRepository {
  create(
    email: string,
    hashedPassword: string,
    name: string,
    role: Role
  ): Promise<Users>;

  findById(id: string): Promise<Users | null>;

  findAll(): Promise<Users[]>;

  findByEmail(email: string): Promise<Users | null>;

  update(id: string, email: string, password: string): Promise<Users>;

  updatePassword(id: string, hashedPassword: string): Promise<Users>;

  delete(id: string): Promise<void>;
}
