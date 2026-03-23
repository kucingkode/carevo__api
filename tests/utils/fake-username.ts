import { faker } from "@faker-js/faker";

export const fakeUsername = () =>
  faker.internet
    .username()
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .substring(0, 30)
    .padEnd(3, "a");
