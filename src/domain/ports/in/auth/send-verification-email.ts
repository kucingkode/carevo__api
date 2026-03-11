import z from "zod";

// request
export const sendVerificationEmailRequestDtoSchema = z.object({
  email: z.email(),
});

export type SendVerificationEmailRequestDto = z.infer<
  typeof sendVerificationEmailRequestDtoSchema
>;

// use case
export type SendVerificationEmailUseCase = {
  sendVerificationEmail(dto: SendVerificationEmailRequestDto): Promise<void>;
};
