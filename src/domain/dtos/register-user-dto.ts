import z from "zod";

export const registerUserDtoSchema = z.object({
  username: z.string(),
  email: z.email(),
  password: z.string(),
});

export type RegisterUserDto = z.infer<typeof registerUserDtoSchema>;
