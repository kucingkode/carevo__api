import { beforeAll, describe, expect, it } from "vitest";
import { waitMessage } from "../../utils/mailpit";
import { TestUser } from "../../utils/test-user";
import { resendVerificationEmail } from "@carevo/contracts/api";
import { faker } from "@faker-js/faker";

describe("POST /v1/email/resend", () => {
  const verifiedUser = new TestUser();
  const unverifiedUser = new TestUser();

  beforeAll(async () => {
    await unverifiedUser.registerOnly();
    await verifiedUser.verify();
  });

  it("resends verification email", async () => {
    const emailMsgPromise = waitMessage(unverifiedUser.email);

    await resendVerificationEmail({
      email: unverifiedUser.email,
    });

    const emailMsg = await emailMsgPromise;
    expect(emailMsg.Subject).toBe("Verifikasi Email Anda");
  });

  it("fails silently on unknown email", async () => {
    const randomEmail = faker.internet.email();

    let isEmailReceived = false;

    waitMessage(randomEmail).then(() => (isEmailReceived = true));

    await resendVerificationEmail({
      email: randomEmail,
    });

    setTimeout(() => {
      expect(isEmailReceived).toBe(false);
    }, 2000);
  });

  it("fails silently on verified email", async () => {
    const verifiedUserEmail = faker.internet.email();

    let isEmailReceived = false;

    waitMessage(verifiedUserEmail).then(() => (isEmailReceived = true));

    await resendVerificationEmail({
      email: verifiedUserEmail,
    });

    setTimeout(() => {
      expect(isEmailReceived).toBe(false);
    }, 2000);
  });
});
