import z from "zod";

// request
export const aiGenerateCvRequestDtoSchema = z.object({
  requestUserId: z.string(),
  input: z.object(),
  section: z.enum([]),
});

export type AiGenerateCvRequestDto = z.infer<
  typeof aiGenerateCvRequestDtoSchema
>;

// use case
export type AiGenerateCvUseCase = {
  aiGenerateCv(dto: AiGenerateCvRequestDto): AsyncIterable<string>;
};
