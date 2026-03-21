import type { Comment } from "@/domain/entities/comment";
import z from "zod";

// request
export const listCommentsInputSchema = z.object({
  postId: z.uuidv7(),
  parentId: z.uuidv7().optional(),
  page: z.int().min(1).optional(),
  limit: z.int().min(1).optional(),
});

export type ListCommentsInput = z.infer<typeof listCommentsInputSchema>;

// response
export type ListCommentsOutput = {
  comments: Comment[];
};

export type ListCommentsUseCase = {
  listComments(input: ListCommentsInput): Promise<ListCommentsOutput>;
};
