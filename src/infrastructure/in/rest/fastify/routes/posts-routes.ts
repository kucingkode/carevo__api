import type { FastifyApp } from "../create-app";
import type { FastifyRestServerParams } from "../params";

export function postsRoutes(params: FastifyRestServerParams) {
  return async (app: FastifyApp) => {
    // ===============================
    // createPost
    // ===============================

    app.post("/", async (req, reply) => {});

    // ===============================
    // getPostsFeed
    // ===============================

    app.get("/feed", async (req, reply) => {});

    // ===============================
    // likePost
    // ===============================

    app.get("/:postId/likes", async (req, reply) => {});

    // ===============================
    // deletePostLike
    // ===============================

    app.delete("/:postId/likes", async (req, reply) => {});

    // ===============================
    // listComments
    // ===============================

    app.get("/:postId/comments", async (req, reply) => {});

    // ===============================
    // createComment
    // ===============================

    app.post("/:postId/comments", async (req, reply) => {});

    // ===============================
    // deleteComment
    // ===============================

    app.delete("/:postId/comments/:commentId", async (req, reply) => {});
  };
}
