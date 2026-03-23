import { describe, expect, it } from "vitest";
import { TestUser } from "../../utils/test-user";
import { faker } from "@faker-js/faker";
import { createCookieJarAdapter } from "../../utils/cookie-jar-adapter";
import { changeUserPassword, loginUser } from "@carevo/contracts/api";
import { AxiosError } from "axios";

describe("POST /v1/auth/password/change", () => {
  it("changes user password", async () => {
    const user = new TestUser();
    const newPassword = faker.internet.password();

    const { cookieJarAdapter } = createCookieJarAdapter();

    await user.verify();
    await user.login(cookieJarAdapter);

    await changeUserPassword(
      {
        oldPassword: user.password,
        newPassword: newPassword,
      },
      {
        adapter: cookieJarAdapter,
      },
    );

    try {
      await loginUser({
        email: user.email,
        password: user.password,
        rememberMe: true,
      });
      expect.fail();
    } catch (err) {
      expect(err).toBeInstanceOf(AxiosError);
      if (err instanceof AxiosError) {
        expect(err.response?.data.error).toBe("INCORRECT_CREDENTIALS");
      }
    }
  });

  it("returns UNAUTHORIZED without access token", async () => {
    try {
      await changeUserPassword({
        oldPassword: faker.internet.password(),
        newPassword: faker.internet.password(),
      });

      expect.fail();
    } catch (err) {
      expect(err).toBeInstanceOf(AxiosError);
      if (err instanceof AxiosError) {
        expect(err.response?.data.error).toBe("UNAUTHORIZED");
      }
    }
  });

  it("returns INCORRECT_PASSWORD on wrong password", async () => {
    const user = new TestUser();
    const newPassword = faker.internet.password();

    const { cookieJarAdapter } = createCookieJarAdapter();

    await user.verify();
    await user.login(cookieJarAdapter);

    try {
      await changeUserPassword(
        {
          oldPassword: faker.internet.password(),
          newPassword: newPassword,
        },
        {
          adapter: cookieJarAdapter,
        },
      );

      expect.fail();
    } catch (err) {
      expect(err).toBeInstanceOf(AxiosError);
      if (err instanceof AxiosError) {
        expect(err.response?.data.error).toBe("INCORRECT_PASSWORD");
      }
    }
  });
});
