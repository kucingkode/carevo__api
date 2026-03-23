import { GET_USER_USE_CASE, READ_ONLY_DB_TX } from "@/constants";
import { InfrastructureError } from "@/domain/errors/infrastructure-errors";
import type {
  GetUserInput,
  GetUserOutput,
  GetUserUseCase,
} from "@/domain/ports/in/users/get-user";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { UsersRepository } from "@/domain/ports/out/database/users-repository";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type GetUserServiceDeps<TxCtx extends TxContext> = {
  db: Database<TxCtx>;
  usersRepository: UsersRepository<TxCtx>;
};

export class GetUserService<TxCtx extends TxContext>
  extends BaseUseCase
  implements GetUserUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly usersRepository: UsersRepository<TxCtx>;

  constructor(deps: GetUserServiceDeps<TxCtx>) {
    super(GET_USER_USE_CASE);

    this.db = deps.db;
    this.usersRepository = deps.usersRepository;
  }

  async getUser(input: GetUserInput): Promise<GetUserOutput> {
    const user = await this.db.beginTx(
      (ctx) => this.usersRepository.getById(ctx, input.requestUserId),
      READ_ONLY_DB_TX,
    );

    if (!user) {
      this.log.error(
        { requestUserId: input.requestUserId },
        "Data integrity violation: authenticated user not found",
      );

      throw new InfrastructureError("Data integrity violation");
    }

    return {
      email: user.email,
      userId: user.id,
      username: user.username,
    };
  }
}
