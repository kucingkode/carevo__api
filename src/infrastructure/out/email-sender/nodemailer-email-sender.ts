import { EMAIL_SENDER_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type {
  EmailSender,
  SendMailParams,
} from "@/domain/ports/out/email-sender";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import { createTransport, type Transporter } from "nodemailer";

export type NodemailerEmailSenderConfig = {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    email: string;
    password: string;
  };
};

export class NodemailerEmailSender extends BaseAdapter implements EmailSender {
  private readonly transporter: Transporter;

  constructor(config: NodemailerEmailSenderConfig) {
    super(EMAIL_SENDER_PORT, OUTBOUND_DIRECTION);

    this.transporter = createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.auth.email,
        pass: config.auth.password,
      },
    });
  }

  async sendMail(params: SendMailParams) {
    await this.transporter.sendMail({
      from: params.from,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
  }
}
