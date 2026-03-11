import z from "zod";

// request
export const leaveCommunityRequestDto = z.object({
  requestUserId: z.uuidv7(),
  communityId: z.uuidv7(),
});

export type LeaveCommunityRequestDto = z.infer<typeof leaveCommunityRequestDto>;

// use case
export type LeaveCommunityUseCase = {
  leaveCommunityFeed(dto: LeaveCommunityRequestDto): Promise<void>;
};
