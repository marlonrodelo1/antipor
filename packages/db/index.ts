import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";
import * as schema from "./schema.js";

export * as schema from "./schema.js";
export type Schema = typeof schema;
export type Db = PostgresJsDatabase<Schema>;

export interface CreateClientOptions {
  /**
   * Postgres connection string. Use the pooler URL for serverless / edge.
   * Eg: postgres://USER:PASS@HOST:6543/postgres
   */
  connectionString: string;
  /** Max connections in the pool. Default 1 for serverless. */
  max?: number;
  /** Statement timeout (seconds). Default 30. */
  statementTimeoutSec?: number;
}

export interface AntiportClient {
  db: Db;
  sql: Sql;
  close: () => Promise<void>;
}

/**
 * Crea un cliente Drizzle apuntando a Supabase Postgres.
 * Pensado para uso server-side (Next.js Route Handlers, n8n via REST).
 */
export function createClient(options: CreateClientOptions): AntiportClient {
  const { connectionString, max = 1, statementTimeoutSec = 30 } = options;

  const sql = postgres(connectionString, {
    max,
    prepare: false,
    idle_timeout: 20,
    connect_timeout: 10,
    types: {},
    connection: {
      statement_timeout: statementTimeoutSec * 1000,
    },
  });

  const db = drizzle(sql, { schema });

  return {
    db,
    sql,
    close: async () => {
      await sql.end({ timeout: 5 });
    },
  };
}
