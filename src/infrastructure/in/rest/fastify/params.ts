import type { RegisterUserUseCase } from "@/domain/ports/in/auth/register-user";

export type FastifyRestServerParams = {
  host: string;
  port: number;
  allowedOrigins: string[];

  // services
  registerUserService: RegisterUserUseCase;
};
