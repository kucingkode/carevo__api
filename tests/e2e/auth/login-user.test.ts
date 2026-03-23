import { faker } from "@faker-js/faker";
import { beforeAll, describe, expect, it } from "vitest";
import { fakeUsername } from "../../utils/fake-username";
import { registerUser, loginUser } from "@carevo/contracts/api";
import { createCookieJarAdapter } from "../../utils/cookie-jar-adapter";
import { AxiosError } from "axios";
import { TestUser } from "../../utils/test-user";

describe("POST /v1/auth/login", () => {
  const user = new TestUser();

  beforeAll(async () => {
    await user.verify();
  });

  it("issues session-only refresh token when remember me is disabled", async () => {
    const { cookieJarAdapter, jar } = createCookieJarAdapter();

    const response = await loginUser(
      {
        email: user.email,
        password: user.password,
        rememberMe: false,
      },
      {
        adapter: cookieJarAdapter,
      },
    );

    const cookies = jar.getCookiesSync(process.env.API_URL! + "/v1/auth");

    // check refresh token
    const refreshTokenValid = cookies.some(
      (v) => v.key === "refresh_token" && v.maxAge === null,
    );
    expect(refreshTokenValid).toBe(true);

    expect(response.userId).not.toBeNull();
    expect(response.accessToken).not.toBeNull();
  });

  it("issues long-lived refresh token when remember me is enabled", async () => {
    const { cookieJarAdapter, jar } = createCookieJarAdapter();

    const response = await loginUser(
      {
        email: user.email,
        password: user.password,
        rememberMe: true,
      },
      {
        adapter: cookieJarAdapter,
      },
    );

    const cookies = jar.getCookiesSync(process.env.API_URL! + "/v1/auth");

    // check refresh token
    const refreshTokenValid = cookies.some(
      (v) => v.key === "refresh_token" && v.maxAge !== null,
    );
    expect(refreshTokenValid).toBe(true);

    expect(response.userId).not.toBeNull();
    expect(response.accessToken).not.toBeNull();
  });

  it("returns INCORRECT_CREDENTIALS on wrong email", async () => {
    try {
      await loginUser({
        email: faker.internet.email(),
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

  it("returns INCORRECT_CREDENTIALS on wrong password", async () => {
    try {
      await loginUser({
        email: user.email,
        password: faker.internet.password(),
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

  it("returns EMAIL_NOT_VERIFIED on unverified email", async () => {
    const newEmail = faker.internet.email();
    const newPassword = faker.internet.password();
    const newUsername = fakeUsername();

    await registerUser({
      username: newUsername,
      email: newEmail,
      password: newPassword,
    });

    try {
      await loginUser({
        email: newEmail,
        password: newPassword,
        rememberMe: true,
      });
      expect.fail();
    } catch (err) {
      expect(err).toBeInstanceOf(AxiosError);
      if (err instanceof AxiosError) {
        expect(err.response?.data.error).toBe("EMAIL_NOT_VERIFIED");
      }
    }
  });
});
