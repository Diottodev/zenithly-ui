import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// Disable prepared statements quando usar com alguns serverless environments
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
