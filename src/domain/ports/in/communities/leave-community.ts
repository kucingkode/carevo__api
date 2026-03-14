import z from "zod";

// request
export const leaveCommunityInput = z.object({
  requestUserId: z.uuidv7(),
  communityId: z.uuidv7(),
});

export type LeaveCommunityInput = z.infer<typeof leaveCommunityInput>;

// use case
export type LeaveCommunityUseCase = {
  leaveCommunity(dto: LeaveCommunityInput): Promise<void>;
};
