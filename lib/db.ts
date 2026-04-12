import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var creditEnginePool: Pool | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is required to use deal persistence in Credit Engine V2.",
    );
  }

  return new Pool({
    connectionString,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : undefined,
  });
}

export function getPool() {
  if (!global.creditEnginePool) {
    global.creditEnginePool = createPool();
  }

  return global.creditEnginePool;
}
