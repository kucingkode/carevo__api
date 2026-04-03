import { beforeAll, describe, expect, it } from "vitest";
import { uploadFile } from "@carevo/contracts/api";
import { randomBytes } from "node:crypto";
import { TestUser } from "../../utils/test-user";
import { createCookieJarAdapter } from "../../utils/cookie-jar-adapter";
import { AxiosError } from "axios";

describe("POST /v1/files/upload", () => {
  const user = new TestUser();
  const { cookieJarAdapter } = createCookieJarAdapter();

  beforeAll(async () => {
    await user.verify();
    await user.login(cookieJarAdapter);
  });

  it("stores images and returns the id", async () => {
    const file = new File([randomBytes(1024)], "image.png", {
      type: "image/png",
    });

    const result = await uploadFile({ file }, { adapter: cookieJarAdapter });
    expect(result.fileId).toBeDefined();
  });

  it("returns UNSUPPORTED_MEDIA_TYPE when file type is not allowed", async () => {
    const file = new File([randomBytes(1024)], "virus.sh", {
      type: "application/x-executable",
    });

    try {
      await uploadFile({ file }, { adapter: cookieJarAdapter });
      expect.fail();
    } catch (err) {
      expect(err).toBeInstanceOf(AxiosError);
      if (err instanceof AxiosError) {
        expect(err.response?.data.error).toBe("UNSUPPORTED_MEDIA_TYPE");
      }
    }
  });

  it("returns UNAUTHORIZED without access token", async () => {
    const file = new File([randomBytes(1024)], "image.png", {
      type: "image/png",
    });

    try {
      await uploadFile({ file });
      expect.fail();
    } catch (err) {
      expect(err).toBeInstanceOf(AxiosError);
      if (err instanceof AxiosError) {
        expect(err.response?.data.error).toBe("UNAUTHORIZED");
      }
    }
  });
});
