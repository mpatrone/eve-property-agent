---
description: Use when a user wants to see or list their active clients.
---

# get_clients

Follow this procedure whenever a user asks to see, list, or review their clients.

## 1. Clarify what they need

Confirm the user wants their own active clients (that is what this tool returns —
all clients assigned to the current agent with `active: true`). No filters or extra
data are needed from the user; the tool takes no input. If they asked about inactive
or another agent's clients, tell them this tool cannot return those.

## 2. Run the query

Call `get_clients`. Resolve the agent from the current session and return only that
agent's active clients. Do not call any insert tool as part of this flow — reading
never writes.

## 3. Present the results

Show the returned clients clearly, one per entry, including for each:

- name
- contact (or "not set")
- maxPrice, minBedrooms (or "not set")
- preferredPostcodes (or "none")
- propertyType (or "not set")
- createdAt

Summarize the count (e.g. "You have N active clients"). If the list is empty, say so
plainly rather than implying an error.

## 4. Offer next steps

Ask if the user wants to do anything with these clients — such as adding a new client
(with the `insert_client` procedure, which requires its own gather → show → confirm
flow) or discussing a match against available properties.
