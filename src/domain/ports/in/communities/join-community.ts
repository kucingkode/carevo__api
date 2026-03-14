import z from "zod";

// request
export const joinCommunityInput = z.object({
  requestUserId: z.uuidv7(),
  communityId: z.uuidv7(),
});

export type JoinCommunityInput = z.infer<typeof joinCommunityInput>;

// use case
export type JoinCommunityUseCase = {
  joinCommunity(input: JoinCommunityInput): Promise<void>;
};
