import { UPDATE_USER_PROFTO_USE_CASE } from "@/constants";
import { UnauthorizedError } from "@/domain/errors/domain/unauthorized-error";
import type {
  UpdateUserProftoInput,
  UpdateUserProftoUseCase,
} from "@/domain/ports/in/users/update-user-profto";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { UsersRepository } from "@/domain/ports/out/database/users-repository";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type UpdateUserProftoServiceDeps<TxCtx extends TxContext> = {
  db: Database<TxCtx>;
  usersRepository: UsersRepository<TxCtx>;
};

export class UpdateUserProftoService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements UpdateUserProftoUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly usersRepository: UsersRepository<TxCtx>;

  constructor(deps: UpdateUserProftoServiceDeps<TxCtx>) {
    super(UPDATE_USER_PROFTO_USE_CASE);

    this.db = deps.db;
    this.usersRepository = deps.usersRepository;
  }

  async updateUserProfto(input: UpdateUserProftoInput): Promise<void> {
    if (input.requestUserId !== input.userId) throw new UnauthorizedError();

    await this.db.beginTx((ctx) =>
      this.usersRepository.partialUpdateProfto(ctx, input.userId, input.profto),
    );

    this.log.info({ requestUserId: input.requestUserId }, "User profto udated");
  }
}
