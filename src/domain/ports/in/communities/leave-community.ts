import z from "zod";

// request
export const leaveCommunityInputSchema = z.object({
  requestUserId: z.uuidv7(),
  communityId: z.uuidv7(),
});

export type LeaveCommunityInput = z.infer<typeof leaveCommunityInputSchema>;

// use case
export type LeaveCommunityUseCase = {
  leaveCommunity(input: LeaveCommunityInput): Promise<void>;
};
