import { LIST_USERS_USE_CASE, READ_ONLY_DB_TX } from "@/constants";
import type {
  ListUsersInput,
  ListUsersOutput,
  ListUsersUseCase,
} from "@/domain/ports/in/users/list-users";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { UsersRepository } from "@/domain/ports/out/database/users-repository";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type ListUsersServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  usersRepository: UsersRepository<TxCtx>;
};

export class ListUsersService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements ListUsersUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly usersRepository: UsersRepository<TxCtx>;

  constructor(deps: ListUsersServiceDeps<TxCtx>) {
    super(LIST_USERS_USE_CASE);

    this.db = deps.db;
    this.usersRepository = deps.usersRepository;
  }

  async listUsers(input: ListUsersInput): Promise<ListUsersOutput> {
    const users = await this.db.beginTx(
      (ctx) =>
        this.usersRepository.list(ctx, {
          query: input.query,
          page: input.page,
          limit: input.limit,
        }),
      READ_ONLY_DB_TX,
    );

    return {
      users,
    };
  }
}
