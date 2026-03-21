import type { FastifyApp } from "../create-app";
import type { FastifyRestServerConfig } from "../config";
import type { FastifyRestServerDeps } from "../deps";
import { UnauthorizedError } from "@/domain/errors/domain/unauthorized-error";
import { createPostInputSchema } from "@/domain/ports/in/posts/create-post";
import { getBody, getParams, getQuery, qNumber } from "../utils";
import { getPostsFeedInputSchema } from "@/domain/ports/in/posts/get-posts-feed";
import { likePostInputSchema } from "@/domain/ports/in/posts/like-post";
import { deletePostLikeInputSchema } from "@/domain/ports/in/posts/delete-post-like";
import { listCommentsInputSchema } from "@/domain/ports/in/comments/list-comments";
import { createCommentInputSchema } from "@/domain/ports/in/comments/create-comment";
import { deleteCommentInputSchema } from "@/domain/ports/in/comments/delete-comment";

export function postsRoutes(
  config: FastifyRestServerConfig,
  deps: FastifyRestServerDeps,
) {
  return async (app: FastifyApp) => {
    // ===============================
    // createPost
    // ===============================

    app.post("/", async (req, reply) => {
      if (!req.userId) throw new UnauthorizedError();

      const createPostInput = createPostInputSchema.parse({
        ...getBody(req),
        requestUserId: req.userId,
      });

      const createPostOutput =
        await deps.createPostService.createPost(createPostInput);

      return reply.status(201).send({
        postId: createPostOutput.postId,
        createdAt: createPostOutput.createdAt,
      });
    });

    // ===============================
    // getPostsFeed
    // ===============================

    app.get("/feed", async (req, reply) => {
      if (!req.userId) throw new UnauthorizedError();

      const q = getQuery(req);

      const getPostsFeedInput = getPostsFeedInputSchema.parse({
        requestUserId: req.userId,
        page: qNumber(q.page),
        limit: qNumber(q.limit),
      });

      const getPostsFeedOutput =
        await deps.getPostsFeedService.getPostsFeed(getPostsFeedInput);

      return reply.status(200).send(getPostsFeedOutput.posts.map((p) => p));
    });

    // ===============================
    // likePost
    // ===============================

    app.post("/:postId/likes", async (req, reply) => {
      if (!req.userId) throw new UnauthorizedError();

      const p = getParams(req);

      const likePostInput = likePostInputSchema.parse({
        requestUserId: req.userId,
        postId: p.postId,
      });

      await deps.likePostService.likePost(likePostInput);

      return reply.status(200).send();
    });

    // ===============================
    // deletePostLike
    // ===============================

    app.delete("/:postId/likes", async (req, reply) => {
      if (!req.userId) throw new UnauthorizedError();

      const p = getParams(req);

      const deletePostLikeInput = deletePostLikeInputSchema.parse({
        requestUserId: req.userId,
        postId: p.postId,
      });

      await deps.deletePostLikeService.deletePostLike(deletePostLikeInput);

      return reply.status(200).send();
    });

    // ===============================
    // listComments
    // ===============================

    app.get("/:postId/comments", async (req, reply) => {
      if (!req.userId) throw new UnauthorizedError();

      const p = getParams(req);
      const q = getQuery(req);

      const listCommentsInput = listCommentsInputSchema.parse({
        postId: p.postId,
        parentId: q.parentId,
        page: qNumber(q.page),
        limit: qNumber(q.limit),
      });

      const listCommentsOutput =
        await deps.listCommentsService.listComments(listCommentsInput);

      return reply
        .status(200)
        .send(listCommentsOutput.comments.map((c) => c.toPersistence()));
    });

    // ===============================
    // createComment
    // ===============================

    app.post("/:postId/comments", async (req, reply) => {
      if (!req.userId) throw new UnauthorizedError();

      const p = getParams(req);

      const createCommentInput = createCommentInputSchema.parse({
        ...getBody(req),
        postId: p.postId,
        requestUserId: req.userId,
      });

      const createCommentOutput =
        await deps.createCommentService.createComment(createCommentInput);

      return reply.status(201).send({
        postId: createCommentOutput.commentId,
        createdAt: createCommentOutput.createdAt,
      });
    });

    // ===============================
    // deleteComment
    // ===============================

    app.delete("/:postId/comments/:commentId", async (req, reply) => {
      if (!req.userId) throw new UnauthorizedError();

      const p = getParams(req);

      const deleteCommentInput = deleteCommentInputSchema.parse({
        commentId: p.commentId,
        postId: p.postId,
        requestUserId: req.userId,
      });

      await deps.deleteCommentService.deleteComment(deleteCommentInput);

      return reply.status(200).send();
    });
  };
}
