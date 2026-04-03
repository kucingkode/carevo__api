import { beforeAll, describe, expect, it } from "vitest";
import { TestUser } from "../../utils/test-user";
import { createCookieJarAdapter } from "../../utils/cookie-jar-adapter";
import { createPost, listComments, createComment } from "@carevo/contracts/api";
import { faker } from "@faker-js/faker";
import { AxiosError } from "axios";
import { v7 as uuidV7 } from "uuid";

const TEST_COMMUNITY_ID = "019d1b24-0c91-7b3d-8293-09458bd44aa7";

describe("POST /v1/posts/:postId/comments", () => {
  const user = new TestUser();
  const { cookieJarAdapter } = createCookieJarAdapter();
  const userConfig = {
    adapter: cookieJarAdapter,
  };

  let postId: string;

  beforeAll(async () => {
    await user.verify();
    await user.login(cookieJarAdapter);

    const post = await createPost(
      {
        communityId: TEST_COMMUNITY_ID,
        content: faker.lorem.paragraph(),
      },
      userConfig,
    );

    postId = post.postId;
  });

  it("creates new comment successfully", async () => {
    const parentContent = faker.lorem.paragraph();
    const parent = await createComment(
      postId,
      {
        content: parentContent,
      },
      userConfig,
    );

    const replyContent = faker.lorem.paragraph();
    const reply = await createComment(
      postId,
      {
        content: replyContent,
        parentId: parent.commentId,
      },
      userConfig,
    );

    // check parent
    let actual = await listComments(postId, undefined, userConfig);
    expect(
      actual.some(
        (v) => v.id === parent.commentId && v.content === parentContent,
      ),
    ).toBe(true);
    expect(
      actual.some(
        (v) => v.id === reply.commentId && v.content === replyContent,
      ),
    ).toBe(false);

    // check reply
    actual = await listComments(
      postId,
      {
        parentId: parent.commentId,
      },
      userConfig,
    );
    expect(
      actual.some(
        (v) => v.id === parent.commentId && v.content === parentContent,
      ),
    ).toBe(false);
    expect(
      actual.some(
        (v) => v.id === reply.commentId && v.content === replyContent,
      ),
    ).toBe(true);
  });

  it("returns UNAUTHORIZED without access token", async () => {
    try {
      await createComment(postId, {
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
