import z from "zod";

// request
export const registerUserInputSchema = z.object({
  username: z.string().regex(/^[a-zA-Z0-9_-]{3,30}$/),
  email: z.email().max(255),
  password: z.string().min(8),
});

export type RegisterUserInput = z.infer<typeof registerUserInputSchema>;

// use case
export type RegisterUserUseCase = {
  registerUser(input: RegisterUserInput): Promise<void>;
};
