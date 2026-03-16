export interface Database<TxCtx extends TxContext<any>> {
  beginTx<T>(fn: (ctx: TxCtx) => Promise<T>, config?: TxConfig): Promise<T>;
}

export type TxContext<Tx = any> = {
  readonly tx: Tx;
  rollback(): Promise<void>;
  beginTx(
    fn: (ctx: TxContext<Tx>) => Promise<void>,
    config: TxConfig,
  ): Promise<void>;
};

export type TxConfig = {
  accessMode?: "read only" | "read write";
  deferrable?: boolean;
  isolationLevel?:
    | "read committed"
    | "read uncommitted"
    | "repeatable read"
    | "serializable";
};
