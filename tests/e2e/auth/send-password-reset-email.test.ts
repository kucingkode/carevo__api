import { beforeAll, describe, expect, it } from "vitest";
import { TestUser } from "../../utils/test-user";
import { sendPasswordResetEmail } from "@carevo/contracts/api";
import { waitMessage } from "../../utils/mailpit";

describe("POST /v1/password/forgot", () => {
  const verifiedUser = new TestUser();
  const unverifiedUser = new TestUser();

  beforeAll(async () => {
    await unverifiedUser.registerOnly();
    await verifiedUser.verify();
  });

  it("sends password reset email", async () => {
    const emailMsgPromise = waitMessage(verifiedUser.email);

    await sendPasswordResetEmail({
      email: verifiedUser.email,
    });

    const emailMsg = await emailMsgPromise;
    expect(emailMsg.Subject).toBe("Reset Password Anda");
  });

  it("fails silently on unverified email", async () => {
    let isEmailReceived = false;

    waitMessage(unverifiedUser.email).then(() => (isEmailReceived = true));

    await sendPasswordResetEmail({
      email: unverifiedUser.email,
    });

    setTimeout(() => {
      expect(isEmailReceived).toBe(false);
    }, 2000);
  });
});
