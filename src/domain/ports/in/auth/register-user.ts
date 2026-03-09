import type { RegisterUserDto } from "@/domain/dtos/register-user-dto";

export type RegisterUserUseCase = {
  registerUser(dto: RegisterUserDto): Promise<void>;
};
