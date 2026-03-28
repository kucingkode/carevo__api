import { DrizzleDatabase } from "@/infrastructure/out/database/drizzle/database";
import { getLogger, initLogger } from "@/observability/logging";
import { loadConfig } from "./config";
import { DrizzleUsersRepository } from "@/infrastructure/out/database/drizzle/repositories/users-repository";
import { ArgonHasher } from "@/infrastructure/out/hasher/argon-hasher";
import { NodemailerEmailSender } from "@/infrastructure/out/email-sender/nodemailer-email-sender";
import { RegisterUserService } from "./services/auth/register-user";
import { createFastifyRestServer } from "@/infrastructure/in/rest/fastify/fastify";
import { randomBytes } from "node:crypto";
import {
  CACHE_MAX_SIZE,
  REFRESH_TOKEN_CLEANUP_INTERVAL,
  SERVICE_NAME,
  SERVICE_VERSION,
} from "@/constants";
import { ChangeUserPasswordService } from "./services/auth/change-user-password";
import { LoginUserService } from "./services/auth/login-user";
import { LogoutUserService } from "./services/auth/logout-user";
import { RefreshUserTokenService } from "./services/auth/refresh-user-token";
import { ResetUserPasswordService } from "./services/auth/reset-user-password";
import { SendPasswordResetEmailService } from "./services/auth/send-password-reset-email";
import { SendVerificationEmailService } from "./services/auth/send-verification-email";
import { VerifyUserEmailService } from "./services/auth/verify-user-email";
import { GetBootcampsFeedService } from "./services/bootcamps/get-bootcamps-feed";
import { ListBootcampsService } from "./services/bootcamps/list-bootcamps";
import { GetCertificationsFeedService } from "./services/certifications/get-certifications-feed";
import { ListCertificationsService } from "./services/certifications/list-certifications";
import { CreateCommentService } from "./services/comments/create-comment";
import { DeleteCommentService } from "./services/comments/delete-comment";
import { ListCommentsService } from "./services/comments/list-comments";
import { JoinCommunityService } from "./services/communities/join-community";
import { LeaveCommunityService } from "./services/communities/leave-community";
import { ListCommunitiesService } from "./services/communities/list-communities";
import { AiGenerateCvService } from "./services/cvs/ai-generate-cv";
import { RenderCvService } from "./services/cvs/render-cv";
import { GetCvService } from "./services/cvs/get-cv";
import { UpdateCvService } from "./services/cvs/update-cv";
import { GetFileService } from "./services/files/get-file";
import { UploadFileService } from "./services/files/upload-file";
import { CreatePostService } from "./services/posts/create-post";
import { DeletePostService } from "./services/posts/delete-post";
import { DeletePostLikeService } from "./services/posts/delete-post-like";
import { GetPostsFeedService } from "./services/posts/get-posts-feed";
import { LikePostService } from "./services/posts/like-post";
import { MemoryCache } from "@/infrastructure/out/cache/memory-cache";
import { DrizzleBootcampsRepository } from "@/infrastructure/out/database/drizzle/repositories/bootcamps-repository";
import { DrizzleCertificationsRepository } from "@/infrastructure/out/database/drizzle/repositories/certifications-repository";
import { DrizzleCommentsRepository } from "@/infrastructure/out/database/drizzle/repositories/comments-repository";
import { DrizzleCommunitiesRepository } from "@/infrastructure/out/database/drizzle/repositories/communities-repository";
import { DrizzleCvsRepository } from "@/infrastructure/out/database/drizzle/repositories/cvs-repository";
import { DrizzleFilesRepository } from "@/infrastructure/out/database/drizzle/repositories/files-repository";
import { DrizzlePostsRepository } from "@/infrastructure/out/database/drizzle/repositories/posts-repository";
import { OpenaiEmbeddingProvider } from "@/infrastructure/out/embedding-provider/openai-embedding-provider";
import { LocalFileStorage } from "@/infrastructure/out/file-storage/local-file-storage";
import { JoseJwtSigner } from "@/infrastructure/out/jwt-signer/jose-jwt-signer";
import { OpenaiLlmProvider } from "@/infrastructure/out/llm-provider/openai-llm-provider";
import { PdfmakePdfGenerator } from "@/infrastructure/out/pdf-generator/pdfmake-pdf-generator";
import { DefaultTokenProvider } from "@/infrastructure/out/token-provider/default-token-provider";
import { DrizzleRefreshTokensRepository } from "@/infrastructure/out/database/drizzle/repositories/refresh-tokens-repository";
import { DrizzlePasswordTokensRepository } from "@/infrastructure/out/database/drizzle/repositories/password-tokens-repository";
import { DrizzleEmailTokensRepository } from "@/infrastructure/out/database/drizzle/repositories/email-tokens-repository";
import { GoogleOauthService } from "./services/auth/google-oauth";
import { GetUserCommunitiesService } from "./services/users/get-user-communities";
import { GetUserProftoService } from "./services/users/get-user-profto";
import { ListUsersService } from "./services/users/list-users";
import { UpdateUserProftoService } from "./services/users/update-user-profto";
import { DrizzleUserCommunitiesRepository } from "@/infrastructure/out/database/drizzle/repositories/user-communities-repository";
import { DrizzleUserLikesRepository } from "@/infrastructure/out/database/drizzle/repositories/user-likes-repository";
import { UpdateCvEmbeddingService } from "./services/cvs/update-cv-embedding";
import { GetUserService } from "./services/users/get-user";

export async function bootstrap() {
  // ===============================
  // Config
  // ===============================
  const appConfig = loadConfig();

  // ===============================
  // Handlers
  // ===============================
  // reload handlers
  process.on("SIGHUP", () => {
    log.info("Hang up signal detected, reloading...");
    reload();
  });

  // termination handlers
  process.on("uncaughtException", (err) => {
    log.fatal({ err }, "Uncaught exception detected, attempting shutdown...");
    shutdown(1);
  });

  process.on("SIGTERM", () => {
    log.fatal("Termination signal detected, attempting shutdown...");
    shutdown(0);
  });

  process.on("SIGINT", () => {
    log.fatal("Interrupt signal detected, attempting shutdown...");
    shutdown(0);
  });

  // ===============================
  // Logger
  // ===============================
  initLogger(
    {
      logLevel: appConfig.LOG_LEVEL,
      nodeEnv: appConfig.NODE_ENV,
    },
    {
      service: SERVICE_NAME,
      version: SERVICE_VERSION,
    },
  );

  const log = getLogger();

  // ===============================
  // Outbound Ports
  // ===============================

  // database

  const db = new DrizzleDatabase({
    host: appConfig.DB_HOST,
    port: appConfig.DB_PORT,
    password: appConfig.DB_PASSWORD,
    user: appConfig.DB_USER,
    database: appConfig.DB_DATABASE,
    ssl: appConfig.DB_SSL,
  });

  const bootcampsRepository = new DrizzleBootcampsRepository();
  const certificationsRepository = new DrizzleCertificationsRepository();
  const commentsRepository = new DrizzleCommentsRepository();
  const communitiesRepository = new DrizzleCommunitiesRepository();
  const cvsRepository = new DrizzleCvsRepository();
  const filesRepository = new DrizzleFilesRepository();
  const postsRepository = new DrizzlePostsRepository();
  const usersRepository = new DrizzleUsersRepository();

  const refreshTokensRepository = new DrizzleRefreshTokensRepository();
  const passwordTokensRepository = new DrizzlePasswordTokensRepository();
  const emailTokensRepository = new DrizzleEmailTokensRepository();

  const userCommunitiesRepository = new DrizzleUserCommunitiesRepository();
  const userLikesRepository = new DrizzleUserLikesRepository();

  // others

  const cache = new MemoryCache({
    maxSize: CACHE_MAX_SIZE,
  });

  const emailSender = new NodemailerEmailSender({
    host: appConfig.SMTP_HOST,
    port: appConfig.SMTP_PORT,
    secure: appConfig.SMTP_SECURE,
    auth: {
      email: appConfig.SMTP_AUTH_EMAIL,
      password: appConfig.SMTP_AUTH_PASSWORD,
    },
  });

  const embeddingProvider = new OpenaiEmbeddingProvider({
    apiKey: appConfig.OPENAI_API_KEY,
  });

  const fileStorage = new LocalFileStorage({
    storageDir: appConfig.STORAGE_DIR,
  });

  const hasher = new ArgonHasher({
    secret: appConfig.HASH_PEPPER
      ? Buffer.from(appConfig.HASH_PEPPER, "utf-8")
      : Buffer.alloc(0),
    salt: appConfig.HASH_SALT
      ? Buffer.from(appConfig.HASH_SALT, "utf-8")
      : randomBytes(16),
    hashLength: appConfig.HASH_LENGTH,
    memoryCost: appConfig.HASH_MEMORY_COST,
    timeCost: appConfig.HASH_TIME_COST,
    parallelism: appConfig.HASH_PARALLELISM,
  });

  const jwtSigner = new JoseJwtSigner({
    secret: appConfig.JWT_SECRET,
  });

  const llmProvider = new OpenaiLlmProvider({
    apiKey: appConfig.OPENAI_API_KEY,
  });

  const pdfGenerator = new PdfmakePdfGenerator({});

  const tokenProvider = new DefaultTokenProvider(
    {
      accessTokenTtl: appConfig.ACCESS_TOKEN_TTL,
      refreshTokenTtl: appConfig.REFRESH_TOKEN_TTL,
      refreshTokenTtlExtended: appConfig.REFRESH_TOKEN_TTL_EXTENDED,
    },
    {
      db,
      hasher,
      jwtSigner,
      refreshTokensRepository,
    },
  );

  // ===============================
  // Application
  // ===============================

  // auth

  const changeUserPasswordService = new ChangeUserPasswordService({
    db,
    usersRepository,
    hasher,
  });

  const loginUserService = new LoginUserService({
    db,
    usersRepository,
    tokenProvider,
    hasher,
  });

  const logoutUserService = new LogoutUserService({
    tokenProvider,
  });

  const refreshUserTokenService = new RefreshUserTokenService({
    tokenProvider,
  });

  const registerUserService = new RegisterUserService({
    db,
    usersRepository,
    hasher,
    emailSender,
  });

  const resetUserPasswordService = new ResetUserPasswordService({
    db,
    usersRepository,
    hasher,
    passwordTokensRepository,
    tokenProvider,
  });

  const sendPasswordResetEmailService = new SendPasswordResetEmailService(
    {
      fromEmail: appConfig.SENDER_EMAIL,
      redirectBaseUrl: appConfig.UI_BASE_URL,
    },
    {
      db,
      emailSender,
      usersRepository,
      passwordTokensRepository,
      hasher,
    },
  );

  const sendVerificationEmailService = new SendVerificationEmailService(
    {
      fromEmail: appConfig.SENDER_EMAIL,
      redirectBaseUrl: appConfig.UI_BASE_URL,
    },
    {
      db,
      emailSender,
      usersRepository,
      emailTokensRepository,
      hasher,
    },
  );

  const verifyUserEmailService = new VerifyUserEmailService({
    db,
    usersRepository,
    emailTokensRepository,
    hasher,
  });

  const googleOauthService = new GoogleOauthService(
    {
      fromEmail: appConfig.SENDER_EMAIL,
    },
    {
      db,
      usersRepository,
      emailSender,
      tokenProvider,
    },
  );

  // bootcamps

  const getBootcampsFeedService = new GetBootcampsFeedService({
    db,
    bootcampsRepository,
    cvsRepository,
  });

  const listBootcampsService = new ListBootcampsService({
    db,
    bootcampsRepository,
    cvsRepository,
  });

  // certifications

  const getCertificationsFeedService = new GetCertificationsFeedService({
    db,
    certificationsRepository,
    cvsRepository,
  });

  const listCertificationsService = new ListCertificationsService({
    db,
    certificationsRepository,
    cvsRepository,
  });

  // comments

  const createCommentService = new CreateCommentService({
    db,
    commentsRepository,
  });

  const deleteCommentService = new DeleteCommentService({
    db,
    commentsRepository,
  });

  const listCommentsService = new ListCommentsService({
    db,
    commentsRepository,
  });

  // communities

  const joinCommunityService = new JoinCommunityService({
    db,
    userCommunitiesRepository,
  });

  const leaveCommunityService = new LeaveCommunityService({
    db,
    userCommunitiesRepository,
  });

  const listCommunitiesService = new ListCommunitiesService({
    db,
    communitiesRepository,
  });

  // cvs

  const aiGenerateCvService = new AiGenerateCvService({
    llmProvider,
  });

  const renderCvService = new RenderCvService({
    db,
    cvsRepository,
    pdfGenerator,
  });

  const getCvService = new GetCvService({
    db,
    cvsRepository,
  });

  const updateCvService = new UpdateCvService({
    db,
    cvsRepository,
  });

  const updateCvEmbeddingService = new UpdateCvEmbeddingService({
    db,
    cvsRepository,
    embeddingProvider,
  });

  // files

  const getFileService = new GetFileService(
    {
      storageDir: appConfig.STORAGE_DIR,
    },
    {
      db,
      filesRepository,
    },
  );

  const uploadFileService = new UploadFileService({
    db,
    filesRepository,
    fileStorage,
  });

  // posts

  const createPostService = new CreatePostService({
    db,
    postsRepository,
  });

  const deletePostLikeService = new DeletePostLikeService({
    db,
    userLikesRepository,
    cache,
  });

  const deletePostService = new DeletePostService({
    db,
    postsRepository,
  });

  const getPostsFeedService = new GetPostsFeedService({
    db,
    postsRepository,
    userCommunitiesRepository,
    userLikesRepository,
    cache,
  });

  const likePostService = new LikePostService({
    db,
    userLikesRepository,
    cache,
  });

  // users

  const getUserCommunitiesService = new GetUserCommunitiesService({
    db,
    userCommunitiesRepository,
  });

  const getUserProftoService = new GetUserProftoService({
    db,
    usersRepository,
  });

  const listUsersService = new ListUsersService({
    db,
    usersRepository,
  });

  const updateUserProftoService = new UpdateUserProftoService({
    db,
    usersRepository,
    filesRepository,
    fileStorage,
  });

  const getUserService = new GetUserService({
    db,
    usersRepository,
  });

  // ===============================
  // Tasks
  // ===============================

  setInterval(() => {
    db.beginTx((ctx) => refreshTokensRepository.deleteExpired(ctx));
  }, REFRESH_TOKEN_CLEANUP_INTERVAL);

  // ===============================
  // Inbound Ports
  // ===============================
  const pingDatabase = () => db.ping();

  const app = createFastifyRestServer(
    {
      host: appConfig.HOST,
      port: appConfig.PORT,
      allowedOrigins: appConfig.ALLOWED_ORIGINS.split(","),

      // rate limit
      rateLimitEnabled: appConfig.RATE_LIMIT_ENABLED,
      rateLimitMax: appConfig.RATE_LIMIT_MAX,
      rateLimitWindowMs: appConfig.RATE_LIMIT_WINDOW_MS,

      // under pressure
      maxElu: appConfig.MAX_ELU,
      maxEventLoopDelay: appConfig.MAX_EVENT_LOOP_DELAY,
      maxHeapBytes: appConfig.MAX_HEAP_USED_BYTES,
      maxRssBytes: appConfig.MAX_RSS_BYTES,

      // cookie
      cookieOptions: {
        secure: appConfig.COOKIE_SECURE,
        domain: appConfig.COOKIE_DOMAIN,
        sameSite: appConfig.COOKIE_SAME_SITE,
      },
      signedCookieSecret: appConfig.SIGNED_COOKIE_SECRET,

      // health check
      pingDatabase,

      // google oauth
      googleOauthClientId: appConfig.GOOGLE_OAUTH_CLIENT_ID,
      googleOauthSecret: appConfig.GOOGLE_OAUTH_SECRET,

      // base urls
      apiBaseUrl: appConfig.API_BASE_URL,
      uiBaseUrl: appConfig.UI_BASE_URL,
    },
    {
      tokenProvider,

      // auth
      changeUserPasswordService,
      loginUserService,
      logoutUserService,
      refreshUserTokenService,
      registerUserService,
      resetUserPasswordService,
      sendPasswordResetEmailService,
      sendVerificationEmailService,
      verifyUserEmailService,
      googleOauthService,

      // bootcamps
      getBootcampsFeedService,
      listBootcampsService,

      // certifications
      getCertificationsFeedService,
      listCertificationsService,

      // comments
      createCommentService,
      deleteCommentService,
      listCommentsService,

      // communities
      joinCommunityService,
      leaveCommunityService,
      listCommunitiesService,

      // cvs
      aiGenerateCvService,
      renderCvService,
      getCvService,
      updateCvService,
      updateCvEmbeddingService,

      // files
      getFileService,
      uploadFileService,

      // posts
      createPostService,
      deletePostLikeService,
      deletePostService,
      getPostsFeedService,
      likePostService,

      // users
      getUserCommunitiesService,
      getUserProftoService,
      listUsersService,
      updateUserProftoService,
      getUserService,
    },
  );

  return app;
}

async function shutdown(code: 0 | 1) {
  const logger = getLogger();

  try {
  } catch (err) {
    logger.error({ err }, "Error terminating tracing");
  }

  setTimeout(() => {
    logger.error(
      "graceful shutdown is not achieved after 5 second, aborting...",
    );
    process.abort();
  }, 5000).unref();

  process.exit(code);
}

async function reload() {}
