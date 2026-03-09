import type {
  Database,
  TxContext,
  TxConfig,
} from "@/domain/ports/out/database/database";
import type { PgTransaction } from "drizzle-orm/pg-core";
import { drizzle, type NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import {
  DrizzleError,
  sql,
  type ExtractTablesWithRelations,
} from "drizzle-orm";
import type { ConnectionOptions } from "node:tls";
import * as schema from "./schema";
import { getLogger, type Logger } from "@/observability/logging";
import { DATABASE_PORT, OUTBOUND_DIRECTION } from "@/constants";
import { DatabaseError } from "@/domain/errors/infrastructure/database-error";

export type DrizzleDatabaseParams = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl: "disable" | "allow" | "prefer" | "require" | "verify-ca" | "verify-full";
};

export class DrizzleDatabase implements Database<DrizzleTxContext> {
  private readonly db: ReturnType<typeof this.createDrizzle>;
  private readonly log: Logger;

  constructor(private readonly params: DrizzleDatabaseParams) {
    this.log = getLogger().child({
      component: DrizzleDatabase.name,
      port: DATABASE_PORT,
      direction: OUTBOUND_DIRECTION,
    });

    this.db = this.createDrizzle();
  }

  async ping(): Promise<void> {
    try {
      await this.db.execute(sql`SELECT 1`);
    } catch (err) {
      throw new DatabaseError("Database unreachable", { cause: err });
    }
  }

  async beginTx(
    fn: (ctx: DrizzleTxContext) => Promise<void>,
    config?: TxConfig,
  ) {
    this.log.trace("Transaction started");

    try {
      await this.db.transaction(async (tx) => {
        const txContext = new DrizzleTxContext(tx);
        await fn(txContext);
      }, config);
    } catch (err) {
      if (err instanceof DrizzleError) {
        this.log.trace("Transaction failed");
        throw new DatabaseError("Transaction failed", {
          cause: err,
        });
      }

      throw err;
    }

    this.log.trace("Transaction committed");
  }

  private createDrizzle() {
    let ssl: ConnectionOptions | undefined = undefined;

    switch (this.params.ssl) {
      case "disable":
        ssl = undefined;
        break;
      case "allow":
        ssl = undefined;
        break;
      case "prefer":
        ssl = undefined;
        break;
      case "require":
        ssl = {
          rejectUnauthorized: false,
        };
        break;
      case "verify-ca":
        ssl = {
          rejectUnauthorized: true,
        };
        break;
      case "verify-full":
        ssl = {
          rejectUnauthorized: true,
          servername: this.params.host,
        };
        break;
    }

    return drizzle({
      connection: {
        host: this.params.host,
        port: this.params.port,
        user: this.params.user,
        password: this.params.password,
        database: this.params.database,
        ssl,
      },
      casing: "snake_case",
      schema,
    });
  }
}

export class DrizzleTxContext implements TxContext<DrizzleTx> {
  constructor(readonly tx: DrizzleTx) {}

  rollback(): Promise<void> {
    this.tx.rollback();
  }

  async beginTx(fn: (ctx: TxContext<DrizzleTx>) => Promise<void>) {
    return this.tx.transaction(async (tx) => {
      const txContext = new DrizzleTxContext(tx);
      await fn(txContext);
    });
  }
}

export type DrizzleTx = PgTransaction<
  NodePgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;
