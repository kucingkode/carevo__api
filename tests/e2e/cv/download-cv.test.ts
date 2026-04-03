import { describe, it } from "vitest";

describe("GET /v1/users/:userId/cv/download", () => {
  it("renders CV correctly to PDF format", async () => {
    //
  });

  it("rejects non-owner from downloading non-preview version of the CV", async () => {
    //
  });

  it("returns UNAUTHORIZED without access token", async () => {
    //
  });
});
