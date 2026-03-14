import type { FastifyApp } from "../create-app";
import type { FastifyRestServerParams } from "../params";
import { registerUserInputSchema } from "@/domain/ports/in/auth/register-user";

export function authRoutes(params: FastifyRestServerParams) {
  return async (app: FastifyApp) => {
    // ===============================
    // registerUser
    // ===============================

    app.post(
      "/register",
      {
        config: {
          rateLimit: {
            max: 5,
            timeWindow: "1 minute",
          },
        },
      },
      async (req, reply) => {
        // validate request
        const data = registerUserInputSchema.parse(req.body);

        // register user
        await params.registerUserService.registerUser({
          email: data.email,
          password: data.password,
          username: data.username,
        });

        // send verification email

        return reply.status(201).send({
          message: "Registration successful, please verify your email",
        });
      },
    );

    // ===============================
    // loginUser
    // ===============================

    app.post(
      "/login",
      {
        config: {
          rateLimit: {
            max: 10,
            timeWindow: "1 minute",
          },
        },
      },
      async (req, reply) => {},
    );

    // ===============================
    // logoutUser
    // ===============================

    app.post(
      "/logout",
      {
        config: {
          rateLimit: {
            max: 10,
            timeWindow: "1 minute",
          },
        },
      },
      async (req, reply) => {},
    );

    // ===============================
    // refreshUserToken
    // ===============================

    app.post(
      "/refresh",
      {
        config: {
          rateLimit: {
            max: 10,
            timeWindow: "1 minute",
          },
        },
      },
      async (req, reply) => {},
    );

    // ===============================
    // sendPasswordResetEmail
    // ===============================

    app.post(
      "/password/forgot",
      {
        config: {
          rateLimit: {
            max: 10,
            timeWindow: "1 minute",
          },
        },
      },
      async (req, reply) => {},
    );

    // ===============================
    // resetUserPassword
    // ===============================

    app.post(
      "/password/reset",
      {
        config: {
          rateLimit: {
            max: 10,
            timeWindow: "1 minute",
          },
        },
      },
      async (req, reply) => {},
    );

    // ===============================
    // changeUserPassword
    // ===============================

    app.post(
      "/password/change",
      {
        config: {
          rateLimit: {
            max: 10,
            timeWindow: "1 minute",
          },
        },
      },
      async (req, reply) => {},
    );

    // ===============================
    // verifyUserEmail
    // ===============================

    app.post(
      "/email/verify",
      {
        config: {
          rateLimit: {
            max: 10,
            timeWindow: "1 minute",
          },
        },
      },
      async (req, reply) => {},
    );

    // ===============================
    // resendVerificationEmail
    // ===============================

    app.post(
      "/email/resend",
      {
        config: {
          rateLimit: {
            max: 10,
            timeWindow: "1 minute",
          },
        },
      },
      async (req, reply) => {},
    );
  };
}
