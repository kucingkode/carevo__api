import z from "zod";

// request
export const getUserCommunitiesInputSchema = z.object({
  userId: z.uuidv7(),
});

export type GetUserCommunitiesInput = z.infer<
  typeof getUserCommunitiesInputSchema
>;

// response
export type GetUserCommunitiesOutput = {
  communityIds: string[];
};

// use case
export type GetUserCommunitiesUseCase = {
  getUserCommunities(
    input: GetUserCommunitiesInput,
  ): Promise<GetUserCommunitiesOutput>;
};
