import z from "zod";

// request
export const joinCommunityInputSchema = z.object({
  requestUserId: z.uuidv7(),
  communityId: z.uuidv7(),
});

export type JoinCommunityInput = z.infer<typeof joinCommunityInputSchema>;

// use case
export type JoinCommunityUseCase = {
  joinCommunity(input: JoinCommunityInput): Promise<void>;
};
