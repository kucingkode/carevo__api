import { MailpitClient, type MailpitMessageListItem } from "mailpit-api";

export function waitMessage(to: string): Promise<MailpitMessageListItem> {
  return new Promise((resolve) => {
    const mailpit = new MailpitClient(process.env.MAILPIT_URL!);
    mailpit.onEvent("new", (e) => {
      if (e.Data.To.map((v) => v.Address).includes(to)) {
        mailpit.disconnect();
        resolve(e.Data);
      }
    });
  });
}

export function getMessageSummary(id: string) {
  const mailpit = new MailpitClient(process.env.MAILPIT_URL!);
  return mailpit.getMessageSummary(id);
}
