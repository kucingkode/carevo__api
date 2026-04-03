import { beforeAll, describe, expect, it } from "vitest";
import { TestUser } from "../../utils/test-user";
import { createCookieJarAdapter } from "../../utils/cookie-jar-adapter";
import {
  updateUserProfto,
  getUser,
  getUserProfto,
} from "@carevo/contracts/api";
import { randomProfto } from "../../utils/generators";

describe("PATCH /v1/users/:userId/profto", () => {
  const owner = new TestUser();
  const guest = new TestUser();

  const profto = randomProfto();

  const { cookieJarAdapter: ownerAdapter } = createCookieJarAdapter();
  const { cookieJarAdapter: guestAdapter } = createCookieJarAdapter();

  beforeAll(async () => {
    await owner.verify();
    await owner.login(ownerAdapter);

    await guest.verify();
    await guest.login(guestAdapter);
  });

  it("allows owner to update their profto", async () => {
    const { userId, username } = await getUser({
      adapter: ownerAdapter,
    });

    await updateUserProfto(userId, profto, {
      adapter: ownerAdapter,
    });

    const actual = await getUserProfto(username, {
      adapter: ownerAdapter,
    });

    expect(actual).toEqual(expect.objectContaining(profto));
  });

  it("returns FORBIDDEN for other user", async () => {
    //
  });

  it("returns UNAUTHORIZED without access token", async () => {
    //
  });
});
