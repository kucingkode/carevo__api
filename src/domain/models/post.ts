import { v7 as uuidV7 } from "uuid";
import { DomainError } from "../errors/domain/domain-error";

export type PostData = {
  readonly id: string;
  readonly communityId: string;
  readonly userId: string;
  readonly content: string;
  readonly totalLikes: number;
  readonly createdAt: Date;
};

export type CreatePostParams = {
  readonly communityId: string;
  readonly userId: string;
  readonly content: string;
};

export class Post {
  readonly _id: string;
  readonly _communityId: string;
  readonly _userId: string;
  readonly _content: string;
  readonly _totalLikes: number;
  readonly _createdAt: Date;

  constructor(data: PostData) {
    if (data.totalLikes < 0) {
      throw new DomainError("Negative total likes");
    }

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
    return new Post({
      ...params,
      id: uuidV7(),
      totalLikes: 0,
      createdAt: new Date(),
    });
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
