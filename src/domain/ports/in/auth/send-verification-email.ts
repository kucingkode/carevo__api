import z from "zod";

// request
export const sendVerificationEmailRequestDtoSchema = z.object({
  email: z.email().max(255),
});

export type SendVerificationEmailRequestDto = z.infer<
  typeof sendVerificationEmailRequestDtoSchema
>;

// use case
export type SendVerificationEmailUseCase = {
  sendVerificationEmail(dto: SendVerificationEmailRequestDto): Promise<void>;
};
