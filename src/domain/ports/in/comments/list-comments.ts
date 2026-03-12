import type { CommentData } from "@/domain/models/comment";
import z from "zod";

// request
export const listCommentsRequestDtoSchema = z.object({
  postId: z.uuidv7(),
  parrentId: z.uuidv7().optional(),
  page: z.int().min(1).optional(),
  limit: z.int().min(1).optional(),
});

export type ListCommentsRequestDto = z.infer<
  typeof listCommentsRequestDtoSchema
>;

// response
export type ListCommentsResponseDto = {
  comments: CommentData[];
};

export type ListCommentUseCase = {
  listComment(dto: ListCommentsRequestDto): Promise<ListCommentsResponseDto>;
};
