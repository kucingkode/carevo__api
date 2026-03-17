import { sendVerificationEmailInputSchema } from "@/domain/ports/in/auth/send-verification-email";
import type { FastifyApp } from "../create-app";
import { registerUserInputSchema } from "@/domain/ports/in/auth/register-user";
import { verifyUserEmailInputSchema } from "@/domain/ports/in/auth/verify-user-email";
import { loginUserInputSchema } from "@/domain/ports/in/auth/login-user";
import type { FastifyRestServerConfig } from "../config";
import type { FastifyRestServerDeps } from "../deps";
import { logoutUserInputSchema } from "@/domain/ports/in/auth/logout-user";
import { UnauthorizedError } from "@/domain/errors/domain/unauthorized-error";
import { refreshUserTokenInputSchema } from "@/domain/ports/in/auth/refresh-user-token";
import { sendPasswordResetEmailInputSchema } from "@/domain/ports/in/auth/send-password-reset-email";
import { resetUserPasswordInputSchema } from "@/domain/ports/in/auth/reset-user-password";
import { changeUserPasswordInputSchema } from "@/domain/ports/in/auth/change-user-password";
import type { FastifyRequest } from "fastify";
import { googleOauthInputSchema } from "@/domain/ports/in/auth/google-oauth";

export function authRoutes(
  config: FastifyRestServerConfig,
  deps: FastifyRestServerDeps,
) {
  const getRefreshToken = (req: FastifyRequest) => {
    const refreshTokenCookie = req.cookies["refresh_token"];
    if (!refreshTokenCookie)
      throw new UnauthorizedError("Missing refresh token");

    const refreshToken = req.unsignCookie(refreshTokenCookie);
    if (!refreshToken.valid)
      throw new UnauthorizedError("Invalid refresh token");

    return refreshToken.value;
  };

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
        // register user
        const registerUserInput = registerUserInputSchema.parse({
          ...(req.body || {}),
          ipAddress: req.clientIp,
        });
        await deps.registerUserService.registerUser(registerUserInput);

        // send verification email
        const sendVerificationEmailInput =
          sendVerificationEmailInputSchema.parse({
            email: registerUserInput.email,
            ipAddress: req.clientIp,
          });
        await deps.sendVerificationEmailService.sendVerificationEmail(
          sendVerificationEmailInput,
        );

        return reply.status(201).send();
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
      async (req, reply) => {
        const loginUserInput = loginUserInputSchema.parse({
          ...(req.body || {}),
          ipAddress: req.clientIp,
          userAgent: req.clientUa,
        });

        const loginUserOutput =
          await deps.loginUserService.loginUser(loginUserInput);

        reply.setCookie("refresh_token", loginUserOutput.refreshToken, {
          ...config.cookieOptions,
          httpOnly: true,
          path: "/auth",
          expires: loginUserInput.rememberMe
            ? loginUserOutput.refreshTokenExpiredAt
            : undefined,
          signed: true,
        });

        return reply.status(200).send({
          userId: loginUserOutput.userId,
          accessToken: loginUserOutput.accessToken,
        });
      },
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
      async (req, reply) => {
        const logoutUserInput = logoutUserInputSchema.parse({
          refreshToken: getRefreshToken(req),
        });

        await deps.logoutUserService.logoutUser(logoutUserInput);

        reply.clearCookie("refresh_token");

        return reply.status(200).send();
      },
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
      async (req, reply) => {
        const refreshUserTokenInput = refreshUserTokenInputSchema.parse({
          ...(req.body || {}),
          refreshToken: getRefreshToken(req),
          ipAddress: req.clientIp,
          userAgent: req.clientUa,
        });

        const refreshUserTokenOutput =
          await deps.refreshUserTokenService.refreshUserToken(
            refreshUserTokenInput,
          );

        reply.setCookie("refresh_token", refreshUserTokenOutput.refreshToken, {
          ...config.cookieOptions,
          httpOnly: true,
          path: "/auth",
          expires: refreshUserTokenInput.rememberMe
            ? refreshUserTokenOutput.refreshTokenExpiredAt
            : undefined,
          signed: true,
        });

        return reply.status(200).send({
          accessToken: refreshUserTokenOutput.accessToken,
        });
      },
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
      async (req, reply) => {
        const sendPasswordResetEmailInput =
          sendPasswordResetEmailInputSchema.parse({
            ...(req.body || {}),
            ipAddress: req.clientIp,
          });

        await deps.sendPasswordResetEmailService.sendPasswordResetEmail(
          sendPasswordResetEmailInput,
        );

        return reply.status(200).send();
      },
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
      async (req, reply) => {
        const resetUserPasswordInput = resetUserPasswordInputSchema.parse({
          ...(req.body || {}),
          ipAddress: req.clientIp,
          userAgent: req.clientUa,
        });

        await deps.resetUserPasswordService.resetUserPassword(
          resetUserPasswordInput,
        );

        return reply.status(200).send();
      },
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
      async (req, reply) => {
        console.log("jhwe", req.userId);

        const changeUserPasswordInput = changeUserPasswordInputSchema.parse({
          ...(req.body || {}),
          requestUserId: req.userId,
          ipAddress: req.clientIp,
          userAgent: req.clientUa,
        });

        await deps.changeUserPasswordService.changeUserPassword(
          changeUserPasswordInput,
        );

        return reply.status(200).send();
      },
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
      async (req, reply) => {
        const verifyUserEmailInput = verifyUserEmailInputSchema.parse({
          ...(req.body || {}),
          ipAddress: req.clientIp,
        });

        await deps.verifyUserEmailService.verifyUserEmail(verifyUserEmailInput);

        return reply.status(200).send();
      },
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
      async (req, reply) => {
        const sendVerificationEmailInput =
          sendVerificationEmailInputSchema.parse({
            ...(req.body || {}),
            ipAddress: req.clientIp,
          });

        await deps.sendVerificationEmailService.sendVerificationEmail(
          sendVerificationEmailInput,
        );

        return reply.status(200).send();
      },
    );

    // ===============================
    // googleOauth
    // ===============================

    app.get("/oauth/google/callback", async (req, reply) => {
      const { token } =
        await app.GoogleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);

      const userinfo: any = await app.GoogleOAuth2.userinfo(token);

      console.log(userinfo);

      const googleOauthInput = googleOauthInputSchema.parse({
        email: userinfo["email"],
        emailVerified: userinfo["email_verified"],
        name: userinfo["name"],
        googleId: userinfo["sub"],
        ipAddress: req.clientIp,
        userAgent: req.clientUa,
      });
      const googleOauthOutput =
        await deps.googleOauthService.googleOauth(googleOauthInput);

      reply.setCookie("refresh_token", googleOauthOutput.refreshToken, {
        ...config.cookieOptions,
        httpOnly: true,
        path: "/auth",
        expires: googleOauthOutput.refreshTokenExpiresAt,
        signed: true,
      });

      return reply.redirect(
        `${config.uiBaseUrl}/auth/login#${googleOauthOutput.accessToken}?tokenType=access_token`,
      );
    });
  };
}
