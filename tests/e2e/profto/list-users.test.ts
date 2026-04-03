import { beforeAll, describe, it } from "vitest";
import { TestUser } from "../../utils/test-user";
import { createCookieJarAdapter } from "../../utils/cookie-jar-adapter";

describe("GET /v1/users", () => {
  const user = new TestUser();
  const { cookieJarAdapter } = createCookieJarAdapter();

  beforeAll(async () => {
    await user.verify();
    await user.login(cookieJarAdapter);
  });

  it("returns summaries of users with matching username", async () => {
    //
  });

  it("returns UNAUTHORIZED without access token", async () => {
    //
  });
});
