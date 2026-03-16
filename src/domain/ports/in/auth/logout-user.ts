import z from "zod";

// request
export const logoutUserInputSchema = z.object({
  refreshToken: z.string().length(80),
});

export type LogoutUserInput = z.infer<typeof logoutUserInputSchema>;

// use case
export type LogoutUserUseCase = {
  logoutUser(input: LogoutUserInput): Promise<void>;
};
