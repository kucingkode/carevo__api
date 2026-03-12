import { v7 as uuidV7 } from "uuid";
import { DomainError } from "../errors/domain/domain-error";
import z from "zod";

// ===============================
// Schema & Types
// ===============================

export const postDataSchema = z.object({
  id: z.uuidv7(),
  communityId: z.uuidv7(),
  userId: z.uuidv7(),
  content: z.string().max(2000),
  totalLikes: z.int().min(0),
  createdAt: z.date(),
});

export type PostData = z.infer<typeof postDataSchema>;

export type CreatePostParams = {
  readonly communityId: string;
  readonly userId: string;
  readonly content: string;
};

// ===============================
// Errors
// ===============================

export class PostValidationError extends DomainError {
  constructor() {
    super("Invalid post", "VALIDATION_ERROR");
  }
}

// ===============================
// Post
// ===============================

export class Post {
  readonly _id: string;
  readonly _communityId: string;
  readonly _userId: string;
  readonly _content: string;
  readonly _totalLikes: number;
  readonly _createdAt: Date;

  private constructor(data: PostData) {
    this._id = data.id;
    this._communityId = data.communityId;
    this._userId = data.userId;
    this._content = data.content;
    this._totalLikes = data.totalLikes;
    this._createdAt = data.createdAt;
  }

  // ===============================
  // Factory
  // ===============================
  static create(params: CreatePostParams) {
    const result = postDataSchema.safeParse({
      ...params,
      id: uuidV7(),
      totalLikes: 0,
      createdAt: new Date(),
    });

    if (!result.success) {
      throw new PostValidationError();
    }

    return new Post(result.data);
  }

  static rehydrate(data: PostData) {
    return new Post(data);
  }

  // ===============================
  // Persistence
  // ===============================
  toPersistence(): PostData {
    return {
      id: this._id,
      content: this._content,
      communityId: this._communityId,
      totalLikes: this._totalLikes,
      userId: this._userId,
      createdAt: this._createdAt,
    };
  }
}
