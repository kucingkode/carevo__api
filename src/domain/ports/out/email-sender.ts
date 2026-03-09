export type SendMailParams = {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export type EmailSender = {
  sendMail(params: SendMailParams): Promise<void>;
};
