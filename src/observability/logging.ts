import pino from "pino";
import { requestContext } from "./context";

const basePinoConfig: PinoConfig = {
  hooks: {
    logMethod(args, method, _) {
      const ctx = requestContext.getStore();

      const obj = {
        ...ctx,
      };

      const [a0, a1, ...others] = args;

      if (typeof a0 === "object") {
        method.apply(this, [{ ...a0, ...obj }, a1, ...others]);
        return;
      } else if (typeof a0 === "string") {
        method.apply(this, [obj, a0, a1, ...others]);
        return;
      } else {
        method.apply(this, args);
      }
    },
  },
};

const pinoConfigs: {
  development: PinoConfig;
  production: PinoConfig;
  testing: PinoConfig;
} = {
  development: {
    level: "debug",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "yyyy-mm-dd HH:MM:ss.l o",
      },
    },
  },
  testing: {
    level: "debug",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "yyyy-mm-dd HH:MM:ss.l o",
      },
    },
  },
  production: {
    level: "info",
    base: {
      pid: false,
      hostname: false,
    },
    serializers: {
      err: (err) => ({
        type: err.name,
        message: err.message,
        stack: undefined,
      }),
    },
  },
} as const;

let logger: Logger | undefined = undefined;

export function getLogger() {
  if (!logger) {
    throw new Error("Logger accessed before initialization");
  }

  return logger;
}

export function initLogger(config: LoggerConfig, base?: any) {
  const pinoConfig = {
    ...basePinoConfig,
    ...pinoConfigs[config.nodeEnv],
    base,
  };

  if (config.logLevel) {
    pinoConfig.level = config.logLevel;
  }

  logger = pino(pinoConfig);
}

export type LoggerConfig = {
  nodeEnv: "development" | "production" | "testing";
  logLevel: pino.Level;
};

type PinoConfig = pino.LoggerOptions<never, boolean>;

export type Logger = pino.Logger;
