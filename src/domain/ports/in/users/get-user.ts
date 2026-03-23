import z from "zod";

// input
export const getUserInputSchema = z.object({
  requestUserId: z.uuidv7(),
});

export type GetUserInput = z.infer<typeof getUserInputSchema>;

// output
export type GetUserOutput = {
  userId: string;
  email: string;
  username: string;
};

// use case
export type GetUserUseCase = {
  getUser(input: GetUserInput): Promise<GetUserOutput>;
};
