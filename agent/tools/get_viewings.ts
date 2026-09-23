import { defineTool } from "eve/tools";
import { z } from "zod";
import { eq, and, gte, lt } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { viewings, clients, properties } from "../../db/schema.ts";

export default defineTool({
  description:
    "Retrieve the current agent's viewings scheduled on a given date, including the client's name and contact and the property's address. Returns the matching viewings.",
  inputSchema: z.object({
    date: z
      .string()
      .refine((value) => !Number.isNaN(Date.parse(value)), {
        message: "date must be a valid date string",
      }),
  }),
  async execute({ date }, ctx) {
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

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const rows = await db
      .select({
        id: viewings.id,
        scheduledAt: viewings.scheduledAt,
        status: viewings.status,
        notes: viewings.notes,
        createdAt: viewings.createdAt,
        clientId: clients.id,
        clientName: clients.name,
        clientContact: clients.contact,
        propertyId: properties.id,
        propertyAddress: properties.address,
        propertyPostcode: properties.postcode,
      })
      .from(viewings)
      .innerJoin(clients, eq(viewings.clientId, clients.id))
      .innerJoin(properties, eq(viewings.propertyId, properties.id))
      .where(
        and(
          eq(viewings.agentId, agent.id),
          gte(viewings.scheduledAt, dayStart),
          lt(viewings.scheduledAt, dayEnd)
        )
      );

    return rows.map((row) => ({
      ...row,
      scheduledAt: row.scheduledAt?.toISOString() ?? null,
      createdAt: row.createdAt?.toISOString() ?? null,
    }));
  },
});
