import type { CommentData } from "@/domain/models/comment";
import z from "zod";

// request
export const getCommentsRequestDtoSchema = z.object({
  postId: z.uuidv7(),
  parrentId: z.uuidv7().optional(),
  page: z.int().min(1).optional(),
  limit: z.int().min(1).optional(),
});

export type GetCommentsRequestDto = z.infer<typeof getCommentsRequestDtoSchema>;

// response
export type GetCommentsResponseDto = {
  comments: CommentData[];
};

export type GetCommentUseCase = {
  getComment(dto: GetCommentsRequestDto): Promise<GetCommentsResponseDto>;
};
