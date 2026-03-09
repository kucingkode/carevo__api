import type { User } from "@/domain/models/user";
import type { DrizzleTxContext } from "../database";
import * as schema from "../schema";
import { UsersRepositoryError } from "@/domain/errors/infrastructure/users-repository-error";
import { getLogger, type Logger } from "@/observability/logging";
import { OUTBOUND_DIRECTION, USERS_REPOSITORY_PORT } from "@/constants";
import type {
  EmailUsernameAvailability,
  UsersRepository,
} from "@/domain/ports/out/database/users-repository";
import { eq, or } from "drizzle-orm";

export class DrizzleUsersRepository implements UsersRepository<DrizzleTxContext> {
  log: Logger;

  constructor() {
    this.log = getLogger().child({
      component: DrizzleUsersRepository.name,
      port: USERS_REPOSITORY_PORT,
      direction: OUTBOUND_DIRECTION,
    });
  }

  async insertUser(ctx: DrizzleTxContext, user: User) {
    try {
      await ctx.tx.insert(schema.users).values(user.toPersistence());
      this.log.debug("User inserted");
    } catch (err) {
      throw new UsersRepositoryError("Database insert failed", {
        cause: err,
      });
    }
  }

  async checkAvailability(
    ctx: DrizzleTxContext,
    email: string,
    username: string,
  ): Promise<EmailUsernameAvailability> {
    try {
      const user = await ctx.tx.query.users.findFirst({
        where: or(
          eq(schema.users.email, email),
          eq(schema.users.username, username),
        ),
      });

      const availability: EmailUsernameAvailability = {
        emailTaken: user?.email === email,
        usernameTaken: user?.username === username,
      };

      return availability;
    } catch (err) {
      throw new UsersRepositoryError("Database query failed", {
        cause: err,
      });
    }
  }
}
