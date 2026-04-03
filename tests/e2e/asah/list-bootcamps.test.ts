import { describe, expect, it } from "vitest";
import { TestUser } from "../../utils/test-user";
import { createCookieJarAdapter } from "../../utils/cookie-jar-adapter";
import { listBootcamps } from "@carevo/contracts/api";
import { AxiosError } from "axios";

describe("GET /v1/bootcamps", () => {
  it("returns bootcamps correctly", async () => {
    const user = new TestUser();
    const { cookieJarAdapter } = createCookieJarAdapter();
    const userConfig = {
      adapter: cookieJarAdapter,
    };

    await user.verify();
    await user.login(cookieJarAdapter);

    expect(
      (
        await listBootcamps(
          {
            limit: 3,
          },
          userConfig,
        )
      ).length,
    ).toBe(3);

    expect(
      (
        await listBootcamps(
          {
            professionRole: "Product Manager / Project Manager",
          },
          userConfig,
        )
      ).every((b) => b.professionRole === "Product Manager / Project Manager"),
    ).toBe(true);
  });

  it("returns UNAUTHORIZED without access token", async () => {
    try {
      await listBootcamps();
      expect.fail();
    } catch (err) {
      expect(err).toBeInstanceOf(AxiosError);
      if (err instanceof AxiosError) {
        expect(err.response?.data.error).toBe("UNAUTHORIZED");
      }
    }
  });
});
