import { describe, expect, it } from "vitest";
import { TestUser } from "../../utils/test-user";
import { createCookieJarAdapter } from "../../utils/cookie-jar-adapter";
import { getBootcampsFeed } from "@carevo/contracts/api";
import { AxiosError } from "axios";

describe("GET /v1/certifications/feed", () => {
  it("returns certifications feed", async () => {
    const user = new TestUser();
    const { cookieJarAdapter } = createCookieJarAdapter();
    const userConfig = {
      adapter: cookieJarAdapter,
    };

    await user.verify();
    await user.login(cookieJarAdapter);

    const certifications = await getBootcampsFeed(
      {
        limit: 3,
      },
      userConfig,
    );
    expect(certifications.length).toBe(3);
  });

  it("returns UNAUTHORIZED without access token", async () => {
    try {
      await getBootcampsFeed();
      expect.fail();
    } catch (err) {
      expect(err).toBeInstanceOf(AxiosError);
      if (err instanceof AxiosError) {
        expect(err.response?.data.error).toBe("UNAUTHORIZED");
      }
    }
  });
});
