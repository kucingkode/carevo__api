import { beforeAll, describe, it } from "vitest";
import { TestUser } from "../../utils/test-user";
import { createCookieJarAdapter } from "../../utils/cookie-jar-adapter";
import { aiGenerateCv, getUser } from "@carevo/contracts/api";

describe("POST /v1/ai/generate-cv", () => {
  const user = new TestUser();
  const { cookieJarAdapter } = createCookieJarAdapter();

  beforeAll(async () => {
    await user.verify();
    await user.login(cookieJarAdapter);
  });

  it("streams generated text", async () => {
    const result = await aiGenerateCv(
      {
        input: "Saya menyeleasikan Bootcamp UI/UX.",
        section: "COURSE_DESCRIPTION",
      },
      {
        adapter: cookieJarAdapter,
      },
    );
  });

  it("returns UNAUTHORIZED without access token", async () => {
    //
  });
});
