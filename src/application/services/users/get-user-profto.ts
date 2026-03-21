import { GET_USER_COMMUNITIES_USE_CASE, READ_ONLY_DB_TX } from "@/constants";
import { NotFoundError } from "@/domain/errors/domain/not-found-error";
import type {
  GetUserProftoInput,
  GetUserProftoOutput,
  GetUserProftoUseCase,
} from "@/domain/ports/in/users/get-user-profto";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { UsersRepository } from "@/domain/ports/out/database/users-repository";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type GetUserProftoServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  usersRepository: UsersRepository<TxCtx>;
};

export class GetUserProftoService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements GetUserProftoUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly usersRepository: UsersRepository<TxCtx>;

  constructor(deps: GetUserProftoServiceDeps<TxCtx>) {
    super(GET_USER_COMMUNITIES_USE_CASE);

    this.db = deps.db;
    this.usersRepository = deps.usersRepository;
  }

  async getUserProfto(input: GetUserProftoInput): Promise<GetUserProftoOutput> {
    const profto = await this.db.beginTx(
      (ctx) => this.usersRepository.getProftoByUsername(ctx, input.username),
      READ_ONLY_DB_TX,
    );

    if (!profto) throw new NotFoundError();

    return {
      profto,
    };
  }
}
