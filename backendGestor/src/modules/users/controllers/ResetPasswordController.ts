
import { Request, Response } from "express";
import z from "zod";
import { ResetPasswordService } from "../services/ResetPasswordService";

export class ResetPasswordController {
  constructor(
    private resetPasswordService: ResetPasswordService
  ) {}

  async handle(req: Request, res: Response) {
        console.log("BODY RECEBIDO:", req.body);

    try {
      const resetSchema = z.object({
        email: z
          .string()
          .email({ message: "Email inválido" }),

        password: z
          .string()
          .min(6, {
            message: "Senha deve ter pelo menos 6 caracteres",
          }),
      });


      

    

  const { email, password } = resetSchema.parse(req.body);



      const result = await this.resetPasswordService.execute(
        email,
        password
      );

      console.log("🔥 RESULTADO ZOD:", result);

      return res.status(200).json({
        message: "Senha alterada com sucesso",
        user: result,
      });
    } catch (error) {
      // Erros de validação do Zod
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Dados inválidos",
          details: error.issues,
        });
      }

      // Email não encontrado
      if (
        error instanceof Error &&
        error.message === "Email not found"
      ) {
        return res.status(404).json({
          error: "Email não encontrado",
        });
      }

      console.error("Erro ao resetar senha:", error);

      return res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }
}

