import { defineTool } from "eve/tools";
import { z } from "zod";
import { always } from "eve/tools/approval";
import { db } from "../../db/index.ts";
import { clients } from "../../db/schema.ts";

export default defineTool({
  description:
    "Insert a new client into the database. Returns the created client.",
  inputSchema: z.object({
    name: z.string().min(1),
    contact: z.string().min(1).optional(),
    maxPrice: z.number().int().nonnegative().optional(),
    minBedrooms: z.number().int().nonnegative().optional(),
    preferredPostcodes: z.array(z.string().min(1)).optional(),
    propertyType: z
      .enum([
        "detached",
        "semi-detached",
        "terraced",
        "flat",
        "bungalow",
        "cottage",
        "other",
      ])
      .optional(),
  }),
  async execute(clientDetails, ctx) {
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

    const [client] = await db
      .insert(clients)
      .values({
        ...clientDetails,
        assignedAgentId: agent.id,
      })
      .returning();

    return {
      ...client,
      preferredPostcodes: client.preferredPostcodes ?? [],
      createdAt: client.createdAt?.toISOString() ?? null,
    };
  },
  approval: always(),
});
