import { v7 as uuidV7 } from "uuid";
import { DomainError } from "../errors/domain/domain-error";
import z from "zod";

// ===============================
// Schema & Types
// ===============================

export const postPropsSchema = z.object({
  id: z.uuidv7(),
  communityId: z.uuidv7(),
  userId: z.uuidv7(),
  content: z.string().max(2000),
  createdAt: z.date(),
});

export type PostProps = z.infer<typeof postPropsSchema>;

export type CreatePostParams = {
  readonly communityId: string;
  readonly userId: string;
  readonly content: string;
};

export type PostDisplay = PostProps & {
  totalLikes: number;
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
  private readonly _id: string;
  private readonly _communityId: string;
  private readonly _userId: string;
  private readonly _content: string;
  private readonly _createdAt: Date;

  private constructor(data: PostProps) {
    this._id = data.id;
    this._communityId = data.communityId;
    this._userId = data.userId;
    this._content = data.content;
    this._createdAt = data.createdAt;
  }

  // ===============================
  // Factory
  // ===============================
  static create(params: CreatePostParams) {
    const result = postPropsSchema.safeParse({
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

  static rehydrate(data: PostProps) {
    return new Post(data);
  }

  // ===============================
  // Getters
  // ===============================
  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get communityId() {
    return this._communityId;
  }

  get createdAt() {
    return this._createdAt;
  }

  // ===============================
  // Persistence
  // ===============================
  toPersistence(): PostProps {
    return {
      id: this._id,
      content: this._content,
      communityId: this._communityId,
      userId: this._userId,
      createdAt: this._createdAt,
    };
  }
}
