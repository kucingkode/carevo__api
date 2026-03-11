import z from "zod";

// request
export const joinCommunityRequestDto = z.object({
  requestUserId: z.uuidv7(),
  communityId: z.uuidv7(),
});

export type JoinCommunityRequestDto = z.infer<typeof joinCommunityRequestDto>;

// use case
export type JoinCommunityUseCase = {
  joinCommunityFeed(dto: JoinCommunityRequestDto): Promise<void>;
};
