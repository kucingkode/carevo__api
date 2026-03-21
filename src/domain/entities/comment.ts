import { v7 as uuidV7 } from "uuid";
import z from "zod";
import { DomainError } from "../errors/domain/domain-error";

// ===============================
// Schema & Types
// ===============================

export const commentPropsSchema = z.object({
  id: z.uuidv7(),
  userId: z.uuidv7(),
  postId: z.uuidv7(),
  parentId: z.uuidv7().nullable(),
  content: z.string().max(2000),
  createdAt: z.date(),
});

export type CommentProps = z.infer<typeof commentPropsSchema>;

export type CreateCommentParams = {
  userId: string;
  postId: string;
  parentId?: string;
  content: string;
};

// ===============================
// Errors
// ===============================

export class CommentValidationError extends DomainError {
  constructor() {
    super("Invalid comment", "VALIDATION_ERROR");
  }
}

// ===============================
// Entity
// ===============================

export class Comment {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _postId: string;
  private readonly _parentId: string | null;
  private readonly _content: string;
  private readonly _createdAt: Date;

  private constructor(data: CommentProps) {
    this._id = data.id;
    this._userId = data.userId;
    this._postId = data.postId;
    this._parentId = data.parentId;
    this._content = data.content;
    this._createdAt = data.createdAt;
  }

  // ===============================
  // Factory
  // ===============================
  static create(params: CreateCommentParams) {
    const result = commentPropsSchema.safeParse({
      ...params,
      id: uuidV7(),
      createdAt: new Date(),
    });

    if (!result.success) {
      throw new CommentValidationError();
    }

    return new Comment(result.data);
  }

  static rehydrate(data: CommentProps) {
    return new Comment(data);
  }

  // ===============================
  // Getters
  // ===============================

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  get postId() {
    return this._postId;
  }

  get userId() {
    return this._userId;
  }

  // ===============================
  // Persistence
  // ===============================
  toPersistence(): CommentProps {
    return {
      id: this._id,
      userId: this._userId,
      postId: this._postId,
      parentId: this._parentId,
      content: this._content,
      createdAt: this._createdAt,
    };
  }
}
