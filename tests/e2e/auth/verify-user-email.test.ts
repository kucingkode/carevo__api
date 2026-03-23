import { beforeAll, describe, expect, it } from "vitest";
import { registerUser, verifyUserEmail } from "@carevo/contracts/api";
import { faker } from "@faker-js/faker";
import { fakeUsername } from "../../utils/fake-username";
import { AxiosError } from "axios";
import { getMessageSummary, waitMessage } from "../../utils/mailpit";

describe("POST /v1/email/verify", () => {
  const email = faker.internet.email();
  const username = fakeUsername();
  const password = faker.internet.password();

  const emailMsgPromise = waitMessage(email);

  beforeAll(async () => {
    await registerUser({
      email,
      password,
      username,
    });
  });

  it("verifies user email", async () => {
    const emailMsg = await emailMsgPromise;
    expect(emailMsg.Subject).toBe("Verifikasi Email Anda");

    const emailMsgSummary = await getMessageSummary(emailMsg.ID);
    const link = emailMsgSummary.Text.split("\n")[1].trim();
    const token = link.split("#")[1];

    await verifyUserEmail({
      token,
    });
  });

  it("returns UNAUTHORIZED on invalid token", async () => {
    try {
      await verifyUserEmail({
        token:
          "019d14b0-3de9-76c3-ab81-2bdad582c69d.0000000000000000000000000000000000000000000",
      });

      expect.fail();
    } catch (err: any) {
      expect(err).toBeInstanceOf(AxiosError);
      if (err instanceof AxiosError) {
        expect(err.response?.data.error).toBe("UNAUTHORIZED");
      }
    }
  });
});
