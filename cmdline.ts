import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import {agents} from "./db/schema"
const sql = neon(process.env.DATABASE_URL as string)
export const db = drizzle({ client: sql });

// const result = await db.execute('select 1');

const agent = await db.select().from(agents)
            // .where(eq(agents.slackUserId, "U0C1F092D41"))


console.log(JSON.stringify(agent,null, 2))