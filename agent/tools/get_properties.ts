import { defineTool } from "eve/tools";
import { z } from "zod";
import { eq, ne, and } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { properties } from "../../db/schema.ts";

export default defineTool({
  description:
    "List all active (not sold) properties listed by the current agent. Returns the matching properties.",
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

    const activeProperties = await db
      .select()
      .from(properties)
      .where(
        and(
          eq(properties.listingAgentId, agent.id),
          ne(properties.status, "sold")
        )
      );

    return activeProperties.map((property) => ({
      ...property,
      listedAt: property.listedAt?.toISOString() ?? null,
      soldAt: property.soldAt?.toISOString() ?? null,
    }));
  },
});
