import { CHANGE_USER_PASSWORD_USE_CASE } from "@/constants";
import type {
  ChangeUserPasswordInput,
  ChangeUserPasswordUseCase,
} from "@/domain/ports/in/auth/change-user-password";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type ChangeUserPasswordServiceParams<TxCtx extends TxContext<any>> = {};

export class ChangeUserPasswordService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements ChangeUserPasswordUseCase
{
  constructor(params: ChangeUserPasswordServiceParams<TxCtx>) {
    super(CHANGE_USER_PASSWORD_USE_CASE);
  }

  changeUserPassword(dto: ChangeUserPasswordInput): Promise<void> {
    throw new Error("not implemented");
  }
}
