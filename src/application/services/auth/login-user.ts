import { LOGIN_USER_USE_CASE } from "@/constants";
import type {
  LoginUserInput,
  LoginUserOutput,
  LoginUserUseCase,
} from "@/domain/ports/in/auth/login-user";
import type { TxContext } from "@/domain/ports/out/database/database";
import { BaseUseCase } from "@/shared/classes/base-use-case";

export type LoginUserServiceParams<TxCtx extends TxContext<any>> = {};

export class LoginUserService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements LoginUserUseCase
{
  constructor(params: LoginUserServiceParams<TxCtx>) {
    super(LOGIN_USER_USE_CASE);
  }

  loginUser(dto: LoginUserInput): Promise<LoginUserOutput> {
    throw new Error("not implemented");
  }
}
