import { DrizzleDatabase } from "@/infrastructure/out/database/drizzle/database";
import { getLogger, initLogger } from "@/observability/logging";
import { loadConfig } from "./config";
import { DrizzleUsersRepository } from "@/infrastructure/out/database/drizzle/repositories/users-repository";
import { ArgonHasher } from "@/infrastructure/out/hasher/argon-hasher";
import { NodemailerEmailSender } from "@/infrastructure/out/email-sender/nodemailer-email-sender";
import { RegisterUserService } from "./services/auth/register-user";
import { createFastifyRestServer } from "@/infrastructure/in/rest/fastify/fastify";
import { randomBytes } from "node:crypto";
import { SERVICE_NAME, SERVICE_VERSION } from "@/constants";
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
import { GetCommunitiesFeedService } from "./services/communities/get-communities-feed";
import { JoinCommunityService } from "./services/communities/join-community";
import { LeaveCommunityService } from "./services/communities/leave-community";
import { ListCommunitiesService } from "./services/communities/list-communities";
import { AiGenerateCvService } from "./services/cvs/ai-generate-cv";
import { DownloadCvService } from "./services/cvs/download-cv";
import { GetCvService } from "./services/cvs/get-cv";
import { SaveCvService } from "./services/cvs/save-cv";
import { UpdateCvService } from "./services/cvs/update-cv";
import { GetFileService } from "./services/files/get-file";
import { UploadFileService } from "./services/files/upload-file";
import { CreatePostService } from "./services/posts/create-post";
import { DeletePostService } from "./services/posts/delete-post";
import { DeletePostLikeService } from "./services/posts/delete-post-like";
import { GetPostsFeedService } from "./services/posts/get-posts-feed";
import { LikePostService } from "./services/posts/like-post";
import { GetProftoService } from "./services/proftos/get-profto";
import { ListProftosService } from "./services/proftos/list-proftos";
import { UpdateProftoService } from "./services/proftos/update-profto";
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
import { EmailTokensRepositoryError } from "@/domain/errors/infrastructure/database-error";
import { DrizzleEmailTokensRepository } from "@/infrastructure/out/database/drizzle/repositories/email-tokens-repository";

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
  await db.ping();

  const bootcampsRepository = new DrizzleBootcampsRepository();
  const certificationsRepository = new DrizzleCertificationsRepository();
  const commentsRepository = new DrizzleCommentsRepository();
  const communitiesRepository = new DrizzleCommunitiesRepository();
  const cvsRepository = new DrizzleCvsRepository();
  const filesRepository = new DrizzleFilesRepository();
  const postsRepositort = new DrizzlePostsRepository();
  const usersRepository = new DrizzleUsersRepository();

  const refreshTokensRepository = new DrizzleRefreshTokensRepository();
  const passwordTokensRepository = new DrizzlePasswordTokensRepository();
  const emailTokensRepository = new DrizzleEmailTokensRepository();

  // others

  const cache = new MemoryCache({});

  const emailSender = new NodemailerEmailSender({
    host: appConfig.SMTP_HOST,
    port: appConfig.SMTP_PORT,
    secure: appConfig.SMTP_SECURE,
    auth: {
      email: appConfig.SMTP_AUTH_EMAIL,
      password: appConfig.SMTP_AUTH_PASSWORD,
    },
  });

  const embeddingProvider = new OpenaiEmbeddingProvider({});

  const fileStorage = new LocalFileStorage({});

  const hasher = new ArgonHasher({
    secret: appConfig.HASH_SECRET
      ? Buffer.from(appConfig.HASH_SECRET, "utf-8")
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

  const llmProvider = new OpenaiLlmProvider({});

  const pdfGenerator = new PdfmakePdfGenerator({});

  const tokenProvider = new DefaultTokenProvider({
    config: {
      accessTokenTtl: appConfig.ACCESS_TOKEN_TTL,
      refreshTokenTtl: appConfig.REFRESH_TOKEN_TTL,
    },

    db,
    hasher,
    jwtSigner,
    refreshTokensRepository,
  });

  // ===============================
  // Application
  // ===============================

  // auth

  const changeUserPasswordService = new ChangeUserPasswordService({
    db,
    usersRepository,
  });

  const loginUserService = new LoginUserService({
    db,
    usersRepository,
    tokenProvider,
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
    tokenProvider,
    passwordTokensRepository,
  });

  const sendPasswordResetEmailService = new SendPasswordResetEmailService({
    db,
    emailSender,
    usersRepository,
    passwordTokensRepository,
  });

  const sendVerificationEmailService = new SendVerificationEmailService({
    config: {
      fromEmail: appConfig.SMTP_AUTH_EMAIL,
      redirectBaseUrl: appConfig.REDIRECT_BASE_URL,
    },

    db,
    emailSender,
    usersRepository,
    emailTokensRepository,
    hasher,
  });

  const verifyUserEmailService = new VerifyUserEmailService({
    db,
    usersRepository,
    emailTokensRepository,
    hasher,
  });

  // bootcamps

  const getBootcampsFeedService = new GetBootcampsFeedService({});

  const listBootcampsService = new ListBootcampsService({});

  // certifications

  const getCertificationsFeedService = new GetCertificationsFeedService({});

  const listCertificationsService = new ListCertificationsService({});

  // comments

  const createCommentService = new CreateCommentService({});

  const deleteCommentService = new DeleteCommentService({});

  const listCommentsService = new ListCommentsService({});

  // communities

  const getCommunitiesFeedService = new GetCommunitiesFeedService({});

  const joinCommunityService = new JoinCommunityService({});

  const leaveCommunityService = new LeaveCommunityService({});

  const listCommunitiesService = new ListCommunitiesService({});

  // cvs

  const aiGenerateCvService = new AiGenerateCvService({});

  const downloadCvService = new DownloadCvService({});

  const getCvService = new GetCvService({});

  const saveCvService = new SaveCvService({});

  const updateCvService = new UpdateCvService({});

  // files

  const getFileService = new GetFileService({});

  const uploadFileService = new UploadFileService({});

  // posts

  const createPostService = new CreatePostService({});

  const deletePostLikeService = new DeletePostLikeService({});

  const deletePostService = new DeletePostService({});

  const getPostsFeedService = new GetPostsFeedService({});

  const likePostService = new LikePostService({});

  // proftos

  const getProftoService = new GetProftoService({});

  const listProftosService = new ListProftosService({});

  const updateProftoService = new UpdateProftoService({});

  // ===============================
  // Inbound Ports
  // ===============================
  const pingDatabase = () => db.ping();

  const app = createFastifyRestServer({
    config: {
      host: appConfig.HOST,
      port: appConfig.PORT,
      allowedOrigins: appConfig.ALLOWED_ORIGINS.split(","),
      rateLimitMax: appConfig.RATE_LIMIT_MAX,
      rateLimitWindowMs: appConfig.RATE_LIMIT_WINDOW_MS,
      maxElu: appConfig.MAX_ELU,
      maxEventLoopDelay: appConfig.MAX_EVENT_LOOP_DELAY,
      maxHeapBytes: appConfig.MAX_HEAP_USED_BYTES,
      maxRssBytes: appConfig.MAX_RSS_BYTES,
    },

    pingDatabase,

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
    getCommunitiesFeedService,
    joinCommunityService,
    leaveCommunityService,
    listCommunitiesService,

    // cvs
    aiGenerateCvService,
    downloadCvService,
    getCvService,
    saveCvService,
    updateCvService,

    // files
    getFileService,
    uploadFileService,

    // posts
    createPostService,
    deletePostLikeService,
    deletePostService,
    getPostsFeedService,
    likePostService,

    // proftos
    getProftoService,
    listProftosService,
    updateProftoService,
  });

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
