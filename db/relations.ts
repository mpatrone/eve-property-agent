import * as schema from "./schema"
import { defineRelations } from "drizzle-orm"

export const relations = defineRelations(schema, (r) => ({
    clients: {
        assignedAgent: r.one.agents({
            from: r.clients.assignedAgentId,
            to: r.agents.id
        })
    },
    viewings: {
        property: r.one.properties({
            from: r.viewings.propertyId,
            to: r.properties.id
        }),
        client: r.one.clients({
            from: r.viewings.clientId,
            to: r.clients.id
        }),
        agent: r.one.agents({
            from: r.viewings.agentId,
            to: r.agents.id
        })
    }
}));
