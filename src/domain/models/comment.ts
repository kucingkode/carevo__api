import { v7 as uuidV7 } from "uuid";

export type CommentData = {
  id: string;
  userId: string;
  postId: string;
  parentId?: string;
  content: string;
  createdAt: Date;
};

export type CreateCommentParams = {
  userId: string;
  postId: string;
  parentId?: string;
  content: string;
};

export class Comment {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _postId: string;
  private readonly _parentId?: string;
  private readonly _content: string;
  private readonly _createdAt: Date;

  constructor(data: CommentData) {
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
    return new Comment({
      ...params,
      id: uuidV7(),
      createdAt: new Date(),
    });
  }

  // ===============================
  // Persistence
  // ===============================
  toPersistence(): CommentData {
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
