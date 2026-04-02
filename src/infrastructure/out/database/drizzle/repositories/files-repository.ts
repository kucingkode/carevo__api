import { FILES_REPOSITORY_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type { FilesRepository } from "@/domain/ports/out/database/files-repository";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import type { DrizzleTxContext } from "../database";
import type { File } from "@/domain/entities/file";
import { files } from "../schema";
import { and, eq } from "drizzle-orm";
import { NotFoundError } from "@/domain/errors/domain/not-found-error";
import { FilesRepositoryError } from "@/domain/errors/infrastructure-errors";

export class DrizzleFilesRepository
  extends BaseAdapter
  implements FilesRepository<DrizzleTxContext>
{
  constructor() {
    super(FILES_REPOSITORY_PORT, OUTBOUND_DIRECTION, FilesRepositoryError);
  }

  async getById(
    ctx: DrizzleTxContext,
    fileId: string,
  ): Promise<File | undefined> {
    const result = await ctx.tx.query.files.findFirst({
      where: eq(files.id, fileId),
    });

    if (!result) return;

    return result;
  }

  async listByUserId(ctx: DrizzleTxContext, userId: string): Promise<File[]> {
    const result = await ctx.tx.query.files.findMany({
      where: eq(files.ownerId, userId),
    });

    return result;
  }

  async delete(
    ctx: DrizzleTxContext,
    ownerId: string,
    fileId: string,
  ): Promise<string | undefined> {
    const result = await ctx.tx
      .delete(files)
      .where(and(eq(files.id, fileId), eq(files.ownerId, ownerId)))
      .returning({
        key: files.key,
      });

    this.log.debug({ id: fileId, count: result.length }, "File deleted");

    if (!result.length) return;

    return result[0].key;
  }

  async insert(ctx: DrizzleTxContext, file: File): Promise<void> {
    await ctx.tx.insert(files).values(file);
    this.log.debug({ id: file.id, ownerId: file.ownerId }, "File inserted");
  }

  async updateSize(
    ctx: DrizzleTxContext,
    fileId: string,
    sizeBytes: number,
  ): Promise<void> {
    const result = await ctx.tx
      .update(files)
      .set({
        sizeBytes,
      })
      .where(eq(files.id, fileId))
      .returning({ id: files.id });

    if (!result.length) throw new NotFoundError();

    this.log.debug({ fileId, sizeBytes }, "File size updated");
  }

  async getUserTotalSizeBytes(
    ctx: DrizzleTxContext,
    userId: string,
  ): Promise<number> {
    const result = await ctx.tx.query.files.findMany({
      where: eq(files.ownerId, userId),
      columns: {
        sizeBytes: true,
      },
    });

    return result.reduce((prev, curr) => prev + curr.sizeBytes, 0);
  }
}
