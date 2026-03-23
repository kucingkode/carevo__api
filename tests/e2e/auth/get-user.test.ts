import { beforeAll, describe, expect, it } from "vitest";
import { getUser } from "@carevo/contracts/api";
import { TestUser } from "../../utils/test-user";
import { faker } from "@faker-js/faker";
import { createCookieJarAdapter } from "../../utils/cookie-jar-adapter";
import { AxiosError } from "axios";

describe("GET /v1/users/me", () => {
  const user = new TestUser();
  const { cookieJarAdapter } = createCookieJarAdapter();

  beforeAll(async () => {
    await user.verify();
    await user.login(cookieJarAdapter);
  });

  it("returns current user information", async () => {
    const result = await getUser({
      adapter: cookieJarAdapter,
    });

    expect(result.email).toBe(user.email);
    expect(result.username).toBe(user.username);
    expect(result.userId).toBeDefined();
  });

  it("returns UNAUTHORIZED on unauthorized access", async () => {
    try {
      await getUser();
      expect.fail();
    } catch (err) {
      expect(err).toBeInstanceOf(AxiosError);
      if (err instanceof AxiosError) {
        expect(err.response?.data.error).toBe("UNAUTHORIZED");
      }
    }
  });
});
