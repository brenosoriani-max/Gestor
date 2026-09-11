import { usersRepository } from "../../../repositories/usersRepository";
import bcrypt from "bcrypt";

interface IResetPasswordResponse {
  email: string;
}

export class ResetPasswordService {
  constructor(private userRepo: usersRepository) {}

  async execute(
    email: string,
    newPassword: string
  ): Promise<IResetPasswordResponse> {

    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new Error("Email not found");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userRepo.updatePassword(
      user.id,
      hashedPassword
    );

    return {
      email: user.email,
    };
  }
}