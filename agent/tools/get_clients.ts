import { defineTool } from "eve/tools";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { clients } from "../../db/schema.ts";

export default defineTool({
  description:
    "List all active clients assigned to the current agent. Returns the matching clients.",
  inputSchema: z.object({}),
  async execute(_input, ctx) {
    const slackId = ctx.session.auth.current?.attributes?.user_id as
      | string
      | undefined;
    if (!slackId) {
      throw new Error("Could not get slack id from current session");
    }
    const agent = await db.query.agents.findFirst({
      where: {
        slackUserId: slackId,
      },
    });
    if (!agent) {
      throw new Error(`No user found with slack id: ${slackId}`);
    }

    const activeClients = await db
      .select()
      .from(clients)
      .where(
        and(eq(clients.assignedAgentId, agent.id), eq(clients.active, true))
      );

    return activeClients.map((client) => ({
      ...client,
      preferredPostcodes: client.preferredPostcodes ?? [],
      createdAt: client.createdAt?.toISOString() ?? null,
    }));
  },
});
