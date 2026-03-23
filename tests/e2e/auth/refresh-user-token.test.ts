import { beforeAll, describe, expect, it } from "vitest";
import { TestUser } from "../../utils/test-user";
import { createCookieJarAdapter } from "../../utils/cookie-jar-adapter";
import { refreshUserToken } from "@carevo/contracts/api";
import { AxiosError } from "axios";

describe("POST /v1/refresh", () => {
  const user = new TestUser();
  const { jar, cookieJarAdapter } = createCookieJarAdapter();

  beforeAll(async () => {
    await user.verify();
    await user.login(cookieJarAdapter);
  });

  it("rotates token pair", async () => {
    let cookies = jar.getCookiesSync(process.env.API_URL! + "/v1/auth");
    const oldRefreshToken = cookies.filter((v) => v.key === "refresh_token")[0]
      .value;

    await refreshUserToken({
      adapter: cookieJarAdapter,
    });

    cookies = jar.getCookiesSync(process.env.API_URL! + "/v1/auth");
    const newRefreshToken = cookies.filter((v) => v.key === "refresh_token")[0]
      .value;

    expect(newRefreshToken).not.toBe(oldRefreshToken);
  });

  it("returns REFRESH_TOKEN_INVALID on missing refresh token", async () => {
    try {
      await refreshUserToken();
      expect.fail();
    } catch (err) {
      expect(err).toBeInstanceOf(AxiosError);
      if (err instanceof AxiosError) {
        expect(err.response?.data.error).toBe("REFRESH_TOKEN_INVALID");
      }
    }
  });
});
