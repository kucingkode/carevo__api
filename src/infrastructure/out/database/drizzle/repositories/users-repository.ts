import { User } from "@/domain/models/user";
import type { DrizzleTxContext } from "../database";
import { OUTBOUND_DIRECTION, USERS_REPOSITORY_PORT } from "@/constants";
import type {
  EmailUsernameAvailability,
  UsersRepository,
} from "@/domain/ports/out/database/users-repository";
import { eq, or } from "drizzle-orm";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import { InfrastructureError } from "@/domain/errors/infrastructure/infrastructure-error";
import { users } from "../schema";

export class UsersRepositoryError extends InfrastructureError {}

export class DrizzleUsersRepository
  extends BaseAdapter
  implements UsersRepository<DrizzleTxContext>
{
  constructor() {
    super(USERS_REPOSITORY_PORT, OUTBOUND_DIRECTION);
  }

  async getByEmail(ctx: DrizzleTxContext, email: string) {
    try {
      const result = await ctx.tx.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!result) return null;
      return User.rehydrate(result);
    } catch (err) {
      throw new UsersRepositoryError("Database query failed", {
        cause: err,
      });
    }
  }

  async insertUser(ctx: DrizzleTxContext, user: User) {
    try {
      await ctx.tx.insert(users).values(user.toPersistence());
      this.log.debug("User inserted");
    } catch (err) {
      throw new UsersRepositoryError("Database query failed", {
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
        where: or(eq(users.email, email), eq(users.username, username)),
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

  //
}
