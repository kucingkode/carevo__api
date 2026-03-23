import { beforeAll, describe, expect, it } from "vitest";
import { registerUser } from "@carevo/contracts/api";
import { faker } from "@faker-js/faker";
import { fakeUsername } from "../../utils/fake-username";
import { AxiosError } from "axios";
import { waitMessage } from "../../utils/mailpit";

describe("POST /v1/auth/register", () => {
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

  it("registers a new user", async () => {
    const emailMsg = await emailMsgPromise;
    expect(emailMsg.Subject).toBe("Verifikasi Email Anda");
  });

  it("returns EMAIL_TAKEN on duplicate email", async () => {
    try {
      await registerUser({
        email,
        password,
        username: fakeUsername(),
      });

      expect.fail();
    } catch (err) {
      expect(err).toBeInstanceOf(AxiosError);
      if (err instanceof AxiosError) {
        expect(err.response?.data.error).toBe("EMAIL_TAKEN");
      }
    }
  });

  it("returns USERNAME_TAKEN on duplicate username", async () => {
    try {
      await registerUser({
        email: faker.internet.email(),
        password,
        username,
      });

      expect.fail();
    } catch (err: any) {
      expect(err.response?.data.error).toBe("USERNAME_TAKEN");
    }
  });
});
