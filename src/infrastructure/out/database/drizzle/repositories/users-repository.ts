import { User } from "@/domain/entities/user";
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

  async getById(ctx: DrizzleTxContext, id: string) {
    try {
      const result = await ctx.tx.query.users.findFirst({
        where: eq(users.id, id),
      });

      if (!result) return null;
      return User.rehydrate(result);
    } catch (err) {
      throw new UsersRepositoryError("Database query failed", {
        cause: err,
      });
    }
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

  async getByGoogleId(
    ctx: DrizzleTxContext,
    googleId: string,
  ): Promise<User | null> {
    try {
      const result = await ctx.tx.query.users.findFirst({
        where: eq(users.googleId, googleId),
      });

      if (!result) return null;
      return User.rehydrate(result);
    } catch (err) {
      throw new UsersRepositoryError("Database query failed", {
        cause: err,
      });
    }
  }

  async insert(ctx: DrizzleTxContext, user: User) {
    try {
      await ctx.tx.insert(users).values(user.toPersistence());
      this.log.debug({ id: user.id }, "User inserted");
    } catch (err) {
      throw new UsersRepositoryError("Database query failed", {
        cause: err,
      });
    }
  }

  async update(ctx: DrizzleTxContext, user: User) {
    try {
      const { id, ...values } = user.toPersistence();
      await ctx.tx.update(users).set(values).where(eq(users.id, id));
      this.log.debug({ id }, "User updated");
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

  async checkEmailAvailability(
    ctx: DrizzleTxContext,
    email: string,
  ): Promise<boolean> {
    try {
      const user = await ctx.tx.query.users.findFirst({
        where: or(eq(users.email, email)),
        columns: {
          id: true,
        },
      });

      return !user;
    } catch (err) {
      throw new UsersRepositoryError("Database query failed", {
        cause: err,
      });
    }
  }

  list(ctx: DrizzleTxContext) {}

  getProftoByUserId(ctx: DrizzleTxContext) {}

  updateProfto(ctx: DrizzleTxContext) {}
}
