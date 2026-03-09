export type SendVerificationEmailUseCase = {
  sendVerificationEmail(email: string): Promise<void>;
};
