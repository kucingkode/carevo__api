import type { ProfessionRole } from "@/shared/schemas/zod/profession-role-schema";

export type CertificationData = {
  readonly id: string;
  readonly professionRole: ProfessionRole;
  readonly thumbnailFileId: string;
  readonly name: string;
  readonly redirectUrl: string;
  readonly publisher: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};
