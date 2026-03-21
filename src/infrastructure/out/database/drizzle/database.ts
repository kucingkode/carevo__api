import type {
  Database,
  TxContext,
  TxConfig,
} from "@/domain/ports/out/database/database";
import type { PgTransaction } from "drizzle-orm/pg-core";
import { drizzle, type NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { sql, type ExtractTablesWithRelations } from "drizzle-orm";
import type { ConnectionOptions } from "node:tls";
import * as schema from "./schema";
import { DATABASE_PORT, OUTBOUND_DIRECTION } from "@/constants";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { DatabaseError } from "@/domain/errors/infrastructure-errors";
import { BaseAdapter } from "@/shared/classes/base-adapter";
import { pgMapper } from "./utils/db-error-mapper";
import { PG_CONNECTION_FAILED_ERROR } from "./utils/db-error-codes";
import { ServiceUnavailableError } from "@/domain/errors/domain/service-unavailable-error";

export type DrizzleDatabaseParams = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl: "disable" | "allow" | "prefer" | "require" | "verify-ca" | "verify-full";
};

export class DrizzleDatabase
  extends BaseAdapter
  implements Database<DrizzleTxContext>
{
  public readonly db: ReturnType<typeof this.createDrizzle>;

  constructor(private readonly params: DrizzleDatabaseParams) {
    super(DATABASE_PORT, OUTBOUND_DIRECTION, DatabaseError);

    this.db = this.createDrizzle();
  }

  async ping(): Promise<void> {
    await this.call(
      () => this.db.execute(sql`SELECT 1`),
      "Database ping failed",
    );
  }

  async beginTx<T>(
    fn: (ctx: DrizzleTxContext) => Promise<T>,
    config?: TxConfig,
  ): Promise<T> {
    let result: T;

    await this.call(
      () =>
        this.db.transaction(async (tx) => {
          const txContext = new DrizzleTxContext(tx);
          result = await fn(txContext);
        }, config),
      "beginTx: Transaction failed",
      pgMapper({
        [PG_CONNECTION_FAILED_ERROR]: () =>
          new ServiceUnavailableError("Database unavailable"),
      }),
    );

    return result!;
  }

  async migrate() {
    await migrate(this.db, { migrationsFolder: "./drizzle" });
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
