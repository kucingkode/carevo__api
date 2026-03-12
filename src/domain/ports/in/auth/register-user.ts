import z from "zod";

// request
export const registerUserRequestDtoSchema = z.object({
  username: z.string().regex(/^[a-zA-Z0-9_-]{3,30}$/),
  email: z.email().max(255),
  password: z.string().min(8),
});

export type RegisterUserRequestDto = z.infer<
  typeof registerUserRequestDtoSchema
>;

// use case
export type RegisterUserUseCase = {
  registerUser(dto: RegisterUserRequestDto): Promise<void>;
};
