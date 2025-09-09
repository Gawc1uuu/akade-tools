import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema/schema";

export const db = drizzle({
    schema,
    connection:{
        host:process.env.POSTGRES_HOST,
        user:process.env.POSTGRES_USERNAME,
        password:process.env.POSTGRES_PASSWORD,
        database:process.env.POSTGRES_DB,
    }
})