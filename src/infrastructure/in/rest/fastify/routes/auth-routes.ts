import { AuthRegisterBody } from "@carevo/contracts/zod";
import type { FastifyApp } from "../create-app";
import { RatelimitedError } from "@/domain/errors/rate-limited-error";
import type { FastifyRestServerParams } from "../params";

export function authRoutes(params: FastifyRestServerParams) {
  return async (app: FastifyApp) => {
    const checkRegisterRateLimit = app.createRateLimit({
      max: 5,
      timeWindow: "1 hour",
    });

    app.post("/register", async (req, reply) => {
      // Check rate limit
      const limit = await checkRegisterRateLimit(req);
      if (!limit.isAllowed && limit.isExceeded) {
        throw new RatelimitedError();
      }

      // validate request
      const data = AuthRegisterBody.parse(req.body);

      // call service
      await params.registerUserService.registerUser({
        email: data.email,
        password: data.password,
        username: data.username,
      });

      return reply.status(201).send({
        message: "Registration successful, please verify your email",
      });
    });
  };
}
