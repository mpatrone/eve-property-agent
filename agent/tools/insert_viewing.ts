import { defineTool } from "eve/tools";
import { z } from "zod";
import { always } from "eve/tools/approval";
import { db } from "../../db/index.ts";
import { viewings } from "../../db/schema.ts";

export default defineTool({
  description:
    "Insert a new viewing into the database. Returns the created viewing.",
  inputSchema: z.object({
    propertyId: z.number().int().positive(),
    clientId: z.number().int().positive(),
    scheduledAt: z
      .string()
      .refine((value) => !Number.isNaN(Date.parse(value)), {
        message: "scheduledAt must be a valid date-time string",
      }),
    status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
    notes: z.string().optional(),
  }),
  async execute(viewingDetails, ctx) {
    const scheduledAt = new Date(viewingDetails.scheduledAt);

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

    const [viewing] = await db
      .insert(viewings)
      .values({
        ...viewingDetails,
        scheduledAt,
        agentId: agent.id,
      })
      .returning();

    return {
      ...viewing,
      scheduledAt: viewing.scheduledAt?.toISOString() ?? null,
      createdAt: viewing.createdAt?.toISOString() ?? null,
    };
  },
  approval: always(),
});
