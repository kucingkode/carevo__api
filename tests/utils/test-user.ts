import { faker } from "@faker-js/faker";
import { fakeUsername } from "./fake-username";
import { getMessageSummary, waitMessage } from "./mailpit";
import {
  registerUser,
  verifyUserEmail,
  loginUser,
} from "@carevo/contracts/api";
import type { AxiosAdapter } from "axios";

export class TestUser {
  username: string;
  email: string;
  password: string;

  constructor() {
    this.username = fakeUsername();
    this.email = faker.internet.email();
    this.password = faker.internet.password();
  }

  async registerOnly() {
    await registerUser({
      email: this.email,
      password: this.password,
      username: this.username,
    });
  }

  async verify() {
    const emailMsgPromise = waitMessage(this.email);

    await registerUser({
      email: this.email,
      password: this.password,
      username: this.username,
    });

    const emailMsg = await emailMsgPromise;
    const emailMsgSummary = await getMessageSummary(emailMsg.ID);
    const link = emailMsgSummary.Text.split("\n")[1].trim();
    const token = link.split("#")[1];

    await verifyUserEmail({ token });
  }

  async login(adapter: AxiosAdapter) {
    await loginUser(
      {
        email: this.email,
        password: this.password,
        rememberMe: true,
      },
      {
        adapter,
      },
    );
  }
}
