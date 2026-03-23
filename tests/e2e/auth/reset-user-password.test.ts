import { beforeAll, describe, expect, it } from "vitest";
import { TestUser } from "../../utils/test-user";
import {
  resetUserPassword,
  sendPasswordResetEmail,
  refreshUserToken,
} from "@carevo/contracts/api";
import { createCookieJarAdapter } from "../../utils/cookie-jar-adapter";
import { getMessageSummary, waitMessage } from "../../utils/mailpit";
import { faker } from "@faker-js/faker";
import { AxiosError } from "axios";

describe("POST /v1/password/reset", () => {
  const user = new TestUser();
  const newPassword = faker.internet.password();

  const { cookieJarAdapter } = createCookieJarAdapter();
  let token: string;

  beforeAll(async () => {
    await user.verify();
    await user.login(cookieJarAdapter);

    const emailMsgPromise = waitMessage(user.email);

    await sendPasswordResetEmail({
      email: user.email,
    });

    const emailMsg = await emailMsgPromise;
    const emailMsgSummary = await getMessageSummary(emailMsg.ID);
    const url = emailMsgSummary.Text.trim().split("\n")[1];
    token = url.split("#")[1];
  });

  it("resets user password and revoke all sessions", async () => {
    await resetUserPassword({
      token,
      newPassword,
    });

    try {
      await refreshUserToken({
        adapter: cookieJarAdapter,
      });

      expect.fail();
    } catch (err) {
      expect(err).toBeInstanceOf(AxiosError);
      if (err instanceof AxiosError) {
        expect(err.response?.data.error).toBe("REFRESH_TOKEN_INVALID");
      }
    }

    // re-login is successful
    user.password = newPassword;
    await user.login(cookieJarAdapter);
  });

  it("returns UNAUTHORIZED on used token", async () => {
    try {
      await resetUserPassword({
        token,
        newPassword,
      });

      expect.fail();
    } catch (err) {
      expect(err).toBeInstanceOf(AxiosError);
      if (err instanceof AxiosError) {
        expect(err.response?.data.error).toBe("UNAUTHORIZED");
      }
    }
  });

  it("returns UNAUTHORIZED on invalid token", async () => {
    try {
      await resetUserPassword({
        token:
          "019d14b0-3de9-76c3-ab81-2bdad582c69d.0000000000000000000000000000000000000000000",
        newPassword,
      });

      expect.fail();
    } catch (err) {
      expect(err).toBeInstanceOf(AxiosError);
      if (err instanceof AxiosError) {
        expect(err.response?.data.error).toBe("UNAUTHORIZED");
      }
    }
  });
});
