import { db } from "./db/index";
import { agents } from "./db/schema";
const agent = await db.select().from(agents);
// .where(eq(agents.slackUserId, "U0C1F092D41"))
console.log(JSON.stringify(agent, null, 2));
