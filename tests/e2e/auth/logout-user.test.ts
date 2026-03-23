import { beforeAll, describe, expect, it } from "vitest";
import { createCookieJarAdapter } from "../../utils/cookie-jar-adapter";
import { logoutUser, refreshUserToken } from "@carevo/contracts/api";
import { AxiosError } from "axios";
import { TestUser } from "../../utils/test-user";

describe("POST /v1/auth/logout", () => {
  const user = new TestUser();
  const { cookieJarAdapter } = createCookieJarAdapter();

  beforeAll(async () => {
    await user.verify();
    await user.login(cookieJarAdapter);
  });

  it("ends user session", async () => {
    await logoutUser({
      adapter: cookieJarAdapter,
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
  });

  it("returns UNAUTHORIZED without access token", async () => {
    try {
      await logoutUser();
      expect.fail();
    } catch (err) {
      expect(err).toBeInstanceOf(AxiosError);
      if (err instanceof AxiosError) {
        expect(err.response?.data.error).toBe("UNAUTHORIZED");
      }
    }
  });
});
