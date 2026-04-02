import { DrizzleDatabase } from "@/infrastructure/out/database/drizzle/database";
import { getLogger, initLogger } from "@/observability/logging";
import { READ_ONLY_DB_TX, SERVICE_NAME, SERVICE_VERSION } from "@/constants";
import { loadConfig } from "./application/config";
import { DrizzleFilesRepository } from "./infrastructure/out/database/drizzle/repositories/files-repository";
import { DrizzleUsersRepository } from "./infrastructure/out/database/drizzle/repositories/users-repository";
import { LocalFileStorage } from "./infrastructure/out/file-storage/local-file-storage";
import { GetUserProftoService } from "./application/services/users/get-user-profto";
import { ListUsersService } from "./application/services/users/list-users";
import { NotFoundError } from "./domain/errors/domain/not-found-error";

export async function bootstrap() {
  // ===============================
  // Setup
  // ===============================

  const appConfig = loadConfig();

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

  const db = new DrizzleDatabase({
    host: appConfig.DB_HOST,
    port: appConfig.DB_PORT,
    password: appConfig.DB_PASSWORD,
    user: appConfig.DB_USER,
    database: appConfig.DB_DATABASE,
    ssl: appConfig.DB_SSL,
  });

  const filesRepository = new DrizzleFilesRepository();
  const usersRepository = new DrizzleUsersRepository();

  const fileStorage = new LocalFileStorage({
    storageDir: appConfig.STORAGE_DIR,
  });

  const getUserProftoService = new GetUserProftoService({
    db,
    usersRepository,
  });

  const listUsersService = new ListUsersService({
    db,
    usersRepository,
  });

  // ===============================
  // Execute
  // ===============================

  const users = await listUsersService.listUsers({});

  for (const user of users.users) {
    // get unsed files
    const profto = await getUserProftoService.getUserProfto({
      username: user.username,
    });

    const files = await db.beginTx(
      (ctx) => filesRepository.listByUserId(ctx, user.id),
      READ_ONLY_DB_TX,
    );

    const proftoFileIds = getFileIds(profto.profto);
    const unusedFiles = files.filter((v) => !proftoFileIds.includes(v.id));

    // delete files from storage
    const deletionPromises = unusedFiles.map((file) =>
      fileStorage.delete(file.key),
    );
    await Promise.all(deletionPromises);

    // delete files from database
    await db.beginTx(async (ctx) => {
      const deletionPromises = unusedFiles.map((file) =>
        filesRepository.delete(ctx, user.id, file.id),
      );
      await Promise.all(deletionPromises);
    });
  }
}

function isPlainObject(value: any) {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}

function getFileIds(obj: Record<string, any>): string[] {
  if (!isPlainObject(obj)) return [];

  const fileIds = [];

  for (const [key, value] of Object.entries(obj)) {
    if (isPlainObject(obj)) {
      if (Array.isArray(obj[key])) {
        obj[key].forEach((v) => {
          fileIds.push(...getFileIds(v));
        });
      } else {
        fileIds.push(...getFileIds(obj[key]));
      }
    }

    if (typeof obj[key] === "string" && key.endsWith("FileId")) {
      fileIds.push(value);
    }
  }

  return fileIds;
}
