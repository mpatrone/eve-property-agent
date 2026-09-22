import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { defineTool } from "eve/tools";
import { z } from "zod";
import { db } from "../../db/index.ts";
import { agents, properties } from "../../db/schema.ts";

import { eq } from "drizzle-orm";
import { always } from "eve/tools/approval";
import { sl } from "zod/locales";

export default defineTool({
  description:
    "Insert a new property listing into the database. Returns the created property.",
  inputSchema: z.object({
    address: z.string().min(1),
    postcode: z.string().min(1),
    price: z.number().int().positive(),
    bedrooms: z.number().int().nonnegative(),
    bathrooms: z.number().int().nonnegative(),
    propertyType: z.enum([
      "detached",
      "semi-detached",
      "terraced",
      "flat",
      "bungalow",
      "cottage",
      "other",
    ]),
    status: z.enum(["sold", "available", "under_offer"]),
    description: z.string().optional(),
  }),
  async execute(propertyDetails, ctx) {

    const authenticator = ctx.session.auth.current?.authenticator as string | undefined;
    let agentId: number = 0;
    if (authenticator === "slack-webhook") {
      // we are comming from a slack channel. Check userid in agents table
      const slackId = ctx.session.auth.current?.attributes?.user_id as string | undefined;
      if (!slackId) {
        throw new Error("Could not get slack id from current session");
      }
      const agent = await db.query.agents.findFirst({
        where: {
          slackUserId: slackId
        }
      });
      if (!agent) {
        throw new Error(`No user found with slack id: ${slackId}`);
      }
      agentId = agent.id;
    }
    else if (authenticator === "oidc") {
      const issuer = ctx.session.auth.current?.issuer as string | undefined;
      const user_id = ctx.session.auth.current?.attributes?.user_id as string | undefined;
      if (!issuer || !user_id) {
        throw new Error("oidc incoming channel with no valid issuer or userid");
      }
      if ( issuer !== "https://oidc.vercel.com/po75558-5820s-projects") {
        throw new Error(`oidc incoming channel with issuer ${issuer}`);
      }
      const agent = await db.query.agents.findFirst({
        where: {
          slackUserId: user_id
        }
      });
      if (!agent) {
        throw new Error(`No user found with slack id: ${user_id}`);
      }
      agentId = agent.id;
    }
    else {
      console.log(ctx.session, null, 2)
      throw new Error(`Unknown incoming channel`);
    }

    const [property] = await db.insert(properties).values({
      ...propertyDetails,
      listingAgentId: agentId
    }).returning();

    return {
      ...property,
      listedAt: property.listedAt?.toISOString() ?? null,
      soldAt: property.soldAt?.toISOString() ?? null,
    };
  },
  approval: always(),
});