import { it } from "node:test";
import { beforeAll, describe, expect } from "vitest";
import { TestUser } from "../../utils/test-user";
import { createCookieJarAdapter } from "../../utils/cookie-jar-adapter";
import {
  getUserProfto,
  updateUserProfto,
  getUser,
  type UpdateUserProftoBody,
} from "@carevo/contracts/api";
import { faker } from "@faker-js/faker";
import { randomProfto } from "../../utils/generators";

describe("GET /v1/users/:userId/profto", () => {
  const user = new TestUser();
  const profto = randomProfto();
  const { cookieJarAdapter } = createCookieJarAdapter();

  let userId: string;

  beforeAll(async () => {
    await user.verify();
    await user.login(cookieJarAdapter);

    userId = (await getUser({ adapter: cookieJarAdapter })).userId;

    await updateUserProfto(userId, profto);
  });

  it("returns user profto", async () => {
    const result = getUserProfto(userId);
    expect(result).toEqual(profto);
  });

  it("returns NOT_FOUND when user with the same id not found", async () => {
    //
  });

  it("returns UNAUTHORIZED without access token", async () => {
    //
  });
});
