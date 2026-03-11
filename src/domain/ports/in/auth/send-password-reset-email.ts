import z from "zod";

// request
export const sendPasswordResetEmailRequestDtoSchema = z.object({
  email: z.email(),
});

export type SendPasswordResetEmailRequestDto = z.infer<
  typeof sendPasswordResetEmailRequestDtoSchema
>;

// use case
export type SendPasswordResetEmailUseCase = {
  sendPasswordResetEmail(dto: SendPasswordResetEmailRequestDto): Promise<void>;
};
