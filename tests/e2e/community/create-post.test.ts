import { beforeAll, describe, expect, it } from "vitest";
import { TestUser } from "../../utils/test-user";
import { createCookieJarAdapter } from "../../utils/cookie-jar-adapter";
import { createPost, getPostsFeed } from "@carevo/contracts/api";
import { faker } from "@faker-js/faker";
import { AxiosError } from "axios";
import { v7 as uuidV7 } from "uuid";

const TEST_COMMUNITY_ID = "019d1b24-0c91-7b3d-8293-09458bd44aa7";

describe("POST /v1/posts", () => {
  const user = new TestUser();
  const { cookieJarAdapter } = createCookieJarAdapter();
  const userConfig = {
    adapter: cookieJarAdapter,
  };

  beforeAll(async () => {
    await user.verify();
    await user.login(cookieJarAdapter);
  });

  it("creates new comment successfully", async () => {
    const postContent = faker.lorem.paragraph();
    const post = await createPost(
      {
        communityId: TEST_COMMUNITY_ID,
        content: postContent,
      },
      userConfig,
    );

    const actual = await getPostsFeed({
      sharedPostId: post.postId,
    });
    expect(
      actual.some((v) => v.id === post.postId && v.content === postContent),
    );
  });

  it("returns NOT_FOUND when community with same id not found", async () => {
    try {
      const randomId = uuidV7();
      await createPost(
        {
          communityId: randomId,
          content: faker.lorem.paragraph(),
        },
        userConfig,
      );
      expect.fail();
    } catch (err) {
      expect(err).toBeInstanceOf(AxiosError);
      if (err instanceof AxiosError) {
        expect(err.response?.data.error).toBe("NOT_FOUND");
      }
    }
  });

  it("returns UNAUTHORIZED without access token", async () => {
    try {
      await createPost({
        communityId: TEST_COMMUNITY_ID,
        content: faker.lorem.paragraph(),
      });
      expect.fail();
    } catch (err) {
      expect(err).toBeInstanceOf(AxiosError);
      if (err instanceof AxiosError) {
        expect(err.response?.data.error).toBe("UNAUTHORIZED");
      }
    }
  });
});
