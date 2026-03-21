import { CVS_REPOSITORY_PORT, OUTBOUND_DIRECTION } from "@/constants";
import type { CvsRepository } from "@/domain/ports/out/database/cvs-repository";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import type { DrizzleTxContext } from "../database";
import { Cv, type CvPartialUpdate } from "@/domain/entities/cv";
import { CvsRepositoryError } from "@/domain/errors/infrastructure-errors";
import { eq } from "drizzle-orm";
import { cvEmbeddings, cvs } from "../schema";
import { NotFoundError } from "@/domain/errors/domain/not-found-error";

export class DrizzleCvsRepository
  extends BaseAdapter
  implements CvsRepository<DrizzleTxContext>
{
  constructor() {
    super(CVS_REPOSITORY_PORT, OUTBOUND_DIRECTION, CvsRepositoryError);
  }

  async getByUserId(
    ctx: DrizzleTxContext,
    userId: string,
  ): Promise<Cv | undefined> {
    const result = await ctx.tx.query.cvs.findFirst({
      where: eq(cvs.userId, userId),
    });

    if (!result) return;

    return Cv.rehydrate({
      userId: result.userId,
      personalInformation: result.personalInformation as any,
      certificates: result.certifications as any,
      courses: result.courses as any,
      educations: result.educations as any,
      organziations: result.organizations as any,
      skills: result.skills as any,
      workExperiences: result.workExperiences as any,
      updatedAt: result.updatedAt,
    });
  }

  async insert(ctx: DrizzleTxContext, cv: Cv): Promise<void> {
    await ctx.tx.insert(cvs).values(cv.toPersistence());
    this.log.debug({ userId: cv.userId }, "CV inserted");
  }

  async partialUpdate(
    ctx: DrizzleTxContext,
    userId: string,
    partialCv: CvPartialUpdate,
  ): Promise<void> {
    await ctx.tx
      .update(cvs)
      .set({
        ...partialCv,
        updatedAt: new Date(),
      })
      .where(eq(cvs.userId, userId));

    this.log.debug({ userId }, "CV updated");
  }

  async getEmbedding(
    ctx: DrizzleTxContext,
    userId: string,
  ): Promise<number[] | undefined> {
    const result = await ctx.tx.query.cvEmbeddings.findFirst({
      where: eq(cvEmbeddings.userId, userId),
      columns: {
        embedding: true,
      },
    });

    return result?.embedding;
  }

  async saveEmbedding(
    ctx: DrizzleTxContext,
    userId: string,
    embedding: number[],
  ): Promise<void> {
    await ctx.tx
      .insert(cvEmbeddings)
      .values({
        userId,
        embedding,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: cvEmbeddings.userId,
        set: {
          embedding,
          updatedAt: new Date(),
        },
      });

    this.log.debug({ userId }, "CV embedding saved");
  }
}
