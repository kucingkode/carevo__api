import { User, type UserSummary } from "@/domain/entities/user";
import type { DrizzleTxContext } from "../database";
import { OUTBOUND_DIRECTION, USERS_REPOSITORY_PORT } from "@/constants";
import type {
  EmailUsernameAvailability,
  ListUsersQuery,
  UsersRepository,
} from "@/domain/ports/out/database/users-repository";
import { desc, eq, like, or } from "drizzle-orm";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import { cvs, proftos, users } from "../schema";
import { UsersRepositoryError } from "@/domain/errors/infrastructure-errors";
import type {
  Profto,
  ProftoPartialUpdate,
  ProftoProps,
} from "@/domain/entities/profto";
import { getPagination } from "@/shared/utils/pagination";
import { NotFoundError } from "@/domain/errors/domain/not-found-error";
import type { Cv } from "@/domain/entities/cv";

export class DrizzleUsersRepository
  extends BaseAdapter
  implements UsersRepository<DrizzleTxContext>
{
  constructor() {
    super(USERS_REPOSITORY_PORT, OUTBOUND_DIRECTION, UsersRepositoryError);
  }

  async getById(ctx: DrizzleTxContext, id: string) {
    const result = await ctx.tx.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!result) return;
    return User.rehydrate(result);
  }

  async getByEmail(ctx: DrizzleTxContext, email: string) {
    const result = await ctx.tx.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!result) return;
    return User.rehydrate(result);
  }

  async getByGoogleId(
    ctx: DrizzleTxContext,
    googleId: string,
  ): Promise<User | undefined> {
    const result = await ctx.tx.query.users.findFirst({
      where: eq(users.googleId, googleId),
    });

    if (!result) return;
    return User.rehydrate(result);
  }

  async insert(ctx: DrizzleTxContext, user: User, profto: Profto, cv: Cv) {
    await ctx.tx.insert(users).values(user.toPersistence());
    await ctx.tx.insert(proftos).values(profto.toPersistence());
    await ctx.tx.insert(cvs).values(cv.toPersistence());
    this.log.debug({ id: user.id }, "User inserted");
  }

  async update(ctx: DrizzleTxContext, user: User) {
    const data = user.toPersistence();
    await ctx.tx.update(users).set(data).where(eq(users.id, data.id));
    this.log.debug({ userId: data.id }, "User updated");
  }

  async checkAvailability(
    ctx: DrizzleTxContext,
    email: string,
    username: string,
  ): Promise<EmailUsernameAvailability> {
    const user = await ctx.tx.query.users.findFirst({
      where: or(eq(users.email, email), eq(users.username, username)),
    });

    const availability: EmailUsernameAvailability = {
      emailTaken: user?.email === email,
      usernameTaken: user?.username === username,
    };

    return availability;
  }

  async checkEmailAvailability(
    ctx: DrizzleTxContext,
    email: string,
  ): Promise<boolean> {
    const user = await ctx.tx.query.users.findFirst({
      where: or(eq(users.email, email)),
      columns: {
        id: true,
      },
    });

    return !user;
  }

  async list(
    ctx: DrizzleTxContext,
    query: ListUsersQuery,
  ): Promise<UserSummary[]> {
    const { limit, offset } = getPagination(query.page, query.limit);

    const filter = query.query
      ? or(
          like(users.username, `%${query.query}%`),
          like(proftos.name, `%${query.query}%`),
        )
      : undefined;

    const result = await ctx.tx
      .select({
        id: users.id,
        username: users.username,
        name: proftos.name,
        avatarFileId: proftos.avatarFileId,
        professionRole: proftos.professionRole,
      })
      .from(users)
      .leftJoin(proftos, eq(users.id, proftos.userId))
      .where(filter)
      .orderBy(desc(users.username))
      .limit(limit)
      .offset(offset);

    return result;
  }

  async getProftoByUsername(
    ctx: DrizzleTxContext,
    username: string,
  ): Promise<ProftoProps | undefined> {
    const result = await ctx.tx.query.proftos.findFirst({
      where: eq(users.username, username),
      with: {
        user: {
          columns: {
            username: true,
          },
        },
      },
    });

    if (!result) return;

    return {
      userId: result.userId,
      avatarFileId: result.avatarFileId,
      cvFileId: result.cvFileId,
      email: result.email,
      lastEducation: result.lastEducation,
      name: result.name,
      summary: result.summary,
      professionRole: result.professionRole as any,
      certificates: result.certificates as any,
      experiences: result.experiences as any,
      links: result.links as any,
      projects: result.projects as any,
      updatedAt: result.updatedAt,
    };
  }

  async partialUpdateProfto(
    ctx: DrizzleTxContext,
    userId: string,
    profto: ProftoPartialUpdate,
  ): Promise<void> {
    const result = await ctx.tx
      .update(proftos)
      .set({ ...profto, updatedAt: new Date() })
      .where(eq(proftos.userId, userId))
      .returning({
        userId: proftos.userId,
      });

    if (!result.length) throw new NotFoundError();

    this.log.debug({ userId }, "User profto updated");
  }
}
