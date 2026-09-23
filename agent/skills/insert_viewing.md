---
description: Use when a user wants to book or schedule a new property viewing for a client.
---

# insert_viewing

Follow this procedure whenever a user asks to book, schedule, or create a viewing.

## 1. Identify the client and the property first

Do not guess IDs. Resolve the two parties before gathering anything else:

- **Client** — call `get_clients` to list the current agent's active clients and
  match the name (or contact detail) the user mentioned to one entry, taking its
  `id` as `clientId`. If there is no match or the mention is ambiguous, ask the user
  which client they mean. Never use an ID that did not come from `get_clients`.
- **Property** — call `get_properties` to list the current agent's active listings
  and match the address the user mentioned to one entry, taking its `id` as
  `propertyId`. If there is no match or it is ambiguous, ask the user which property
  they mean. Never use an ID that did not come from `get_properties`.

If the user already knows the exact ID, still verify it against `get_clients` /
`get_properties` before using it.

## 2. Gather the rest of the data

Collect the remaining fields the `insert_viewing` tool requires:

- scheduledAt (date and time of the viewing)
- status (optional, one of: scheduled, completed, cancelled — defaults to scheduled)
- notes (optional)

Ask follow-up questions until every required field is filled in and you are
confident you have understood the user's intent correctly. Never invent values — if
something is missing or ambiguous, ask.

## 3. Show the collected data

Once ALL relevant data is gathered, present the complete set of values back to the
user in a clear, readable summary — showing the client's name and the property's
address alongside their resolved IDs, plus scheduledAt, status, and notes — together
with what will be inserted. Explicitly invite the user to make changes: tell them
they can correct or update any field, or pick a different client or property, before
anything is written.

## 4. Wait for changes

If the user asks to change any value (including the client or property), apply the
change — re-running `get_clients` or `get_properties` if a different party was
selected — and show the full updated summary again. Repeat this cycle until the user
says the data is correct as shown.

## 5. Get explicit confirmation

The user MUST always confirm whether they want to continue with inserting the new
viewing into the database. Ask a direct yes/no question such as "Shall I book this
viewing now?" and stop and wait for their answer.

- If the user does not clearly confirm, do NOT insert. Ask again or stop.
- If the user says no or wants to modify something, return to step 3 or 4.

## 6. Insert only after confirmation

The `insert_viewing` tool must ONLY be called AFTER the client and property have been
identified via `get_clients`/`get_properties`, all relevant data has been gathered,
shown to the user, given a chance to be changed, and the user has explicitly confirmed
the insert. Only then call `insert_viewing` with exactly the confirmed values, and
report the created viewing back to the user.

Never call `insert_viewing` earlier in the conversation, and never call it with an
unconfirmed or partially gathered set of data or an unverified client/property ID.
