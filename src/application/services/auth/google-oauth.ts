import { GOOGLE_OAUTH_USE_CASE, READ_ONLY_DB_TX } from "@/constants";
import { User } from "@/domain/entities/user";
import { EmailNotVerifiedError } from "@/domain/errors/domain/email-not-verified-error";
import type {
  GoogleOauthInput,
  GoogleOauthUseCase,
  GoogleOauthOutput,
} from "@/domain/ports/in/auth/google-oauth";
import type { Database, TxContext } from "@/domain/ports/out/database/database";
import type { UsersRepository } from "@/domain/ports/out/database/users-repository";
import type { EmailSender } from "@/domain/ports/out/email-sender";
import type { TokenProvider } from "@/domain/ports/out/token-provider";
import { BaseUseCase } from "@/shared/classes/base-use-case";
import { parseToken } from "@/shared/utils/token-format";

export type GoogleOauthServiceConfig = {
  fromEmail: string;
};

export type GoogleOauthServiceDeps<TxCtx extends TxContext<any>> = {
  db: Database<TxCtx>;
  usersRepository: UsersRepository<TxCtx>;
  tokenProvider: TokenProvider;
  emailSender: EmailSender;
};

export class GoogleOauthService<TxCtx extends TxContext<any>>
  extends BaseUseCase
  implements GoogleOauthUseCase
{
  private readonly db: Database<TxCtx>;
  private readonly usersRepository: UsersRepository<TxCtx>;
  private readonly tokenProvider: TokenProvider;
  private readonly emailSender: EmailSender;

  constructor(
    private readonly config: GoogleOauthServiceConfig,
    deps: GoogleOauthServiceDeps<TxCtx>,
  ) {
    super(GOOGLE_OAUTH_USE_CASE);

    this.db = deps.db;
    this.usersRepository = deps.usersRepository;
    this.tokenProvider = deps.tokenProvider;
    this.emailSender = deps.emailSender;
  }

  async googleOauth(input: GoogleOauthInput): Promise<GoogleOauthOutput> {
    const logCtx: any = {
      email: input.email,
      googleId: input.googleId,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    };

    // reject if email is not verified
    if (!input.emailVerified) {
      this.log.warn(
        logCtx,
        "User google oauth attempt failed: email not verified",
      );
      throw new EmailNotVerifiedError();
    }

    // retrieve user
    let user = await this.db.beginTx((ctx) => {
      return this.usersRepository.getByGoogleId(ctx, input.googleId);
    }, READ_ONLY_DB_TX);

    // if found
    if (user) {
      // if email changed
      if (user.email !== input.email) {
        const isEmailAvailable = await this.db.beginTx((ctx) => {
          return this.usersRepository.checkEmailAvailability(ctx, input.email);
        }, READ_ONLY_DB_TX);

        // if email is taken, continue
        if (!isEmailAvailable) {
          this.log.warn(
            {
              ...logCtx,
              prevEmail: user.email,
            },
            "User oauth email different from registered email but new email is taken",
          );
        }

        // if email is free, update
        if (isEmailAvailable) {
          this.log.info(
            {
              ...logCtx,
              prevEmail: user.email,
            },
            "User email updated",
          );

          user.changeEmail(input.email);
          await this.db.beginTx((ctx) => {
            return this.usersRepository.update(ctx, user!);
          });
        }
      }

      // if email match, continue
      // no action
    } else {
      // if not found
      let newUser: User;

      const emailUser = await this.db.beginTx((ctx) => {
        return this.usersRepository.getByEmail(ctx, input.email);
      });

      // if email is taken, update
      if (emailUser) {
        emailUser.changeGoogleId(input.googleId);
        emailUser.changeEmail(input.email);

        await this.db.beginTx(async (ctx) => {
          await this.usersRepository.update(ctx, emailUser);

          // if other auth method exists, notify user
          if (emailUser.passwordHash) {
            await this.emailSender.sendMail({
              from: `Carevo <${this.config.fromEmail}>`,
              to: input.email,
              subject: "Peringatan Keamanan",
              text: "Metode login dengan Google telah ditambahkan pada akun Anda.",
            });
          }
        });

        this.log.info(logCtx, "Google oauth authentication method added");

        newUser = emailUser;
      } else {
        // if email is free, create user

        newUser = User.create({
          email: input.email,
          username: this.nameToUsername(input.name),
          googleId: input.googleId,
          passwordHash: null,
        });
        newUser.verifyEmail();

        await this.db.beginTx((ctx) => {
          return this.usersRepository.insert(ctx, newUser);
        });
      }

      this.log.info(logCtx, "User registered using google oauth");

      user = newUser;
    }

    // issue token pair
    const { accessToken, refreshToken } =
      await this.tokenProvider.issueTokenPair(
        {
          userId: user.id,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        },
        {
          rememberMe: true,
        },
      );

    logCtx.refreshTokenId = parseToken(refreshToken.value).id;
    this.log.info(logCtx, "User logged in using Google oauth");

    return {
      userId: user.id,
      accessToken: accessToken.value,
      accessTokenExpiresAt: accessToken.expiresAt,
      refreshToken: refreshToken.value,
      refreshTokenExpiresAt: refreshToken.expiresAt,
    };
  }

  private nameToUsername(name: string) {
    const random = this.generateSecureRandomAlphanumeric(10);
    return name.toLowerCase().replaceAll(" ", "-").slice(0, 20) + random;
  }

  private generateSecureRandomAlphanumeric(length: number) {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";

    const randomArray = new Uint8Array(length);
    crypto.getRandomValues(randomArray);

    let result = "";
    randomArray.forEach((number) => {
      result += chars[number % chars.length];
    });

    return result;
  }
}
