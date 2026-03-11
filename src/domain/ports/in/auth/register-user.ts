import z from "zod";

// request
export const registerUserRequestDtoSchema = z.object({
  username: z.string(),
  email: z.email(),
  password: z.string(),
});

export type RegisterUserRequestDto = z.infer<
  typeof registerUserRequestDtoSchema
>;

// use case
export type RegisterUserUseCase = {
  registerUser(dto: RegisterUserRequestDto): Promise<void>;
};
