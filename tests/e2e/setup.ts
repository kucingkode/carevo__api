import { beforeEach } from "vitest";
import { clearAccessToken } from "@carevo/contracts/api";

beforeEach(() => {
  clearAccessToken();
});
