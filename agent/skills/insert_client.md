---
description: Use when a user wants to add a new client to the database.
---

# insert_client

Follow this procedure whenever a user asks to add, create, or register a new client.

## 1. Gather all relevant data first

Collect every field the `insert_client` tool requires before doing anything else:

- name (required)
- contact (optional — phone or email)
- maxPrice (optional integer, the client's budget ceiling)
- minBedrooms (optional integer)
- preferredPostcodes (optional list of postcodes)
- propertyType (optional, one of: detached, semi-detached, terraced, flat, bungalow, cottage, other)

Ask follow-up questions until the required field is filled in, you have captured every
preference the user wants recorded, and you are confident you have understood the
user's intent correctly. Never invent values — if something is missing or ambiguous,
ask.

## 2. Show the collected data

Once ALL relevant data is gathered, present the complete set of values back to the
user in a clear, readable summary (a field-by-field list works well, showing omitted
optional fields as "not set"), together with what will be inserted. Explicitly invite
the user to make changes: tell them they can correct or update any field before
anything is written.

## 3. Wait for changes

If the user asks to change any value, apply the change and show the full updated
summary again. Repeat this cycle until the user says the data is correct as shown.

## 4. Get explicit confirmation

The user MUST always confirm whether they want to continue with inserting the new
client into the database. Ask a direct yes/no question such as "Shall I add this
client now?" and stop and wait for their answer.

- If the user does not clearly confirm, do NOT insert. Ask again or stop.
- If the user says no or wants to modify something, return to step 2 or 3.

## 5. Insert only after confirmation

The `insert_client` tool must ONLY be called AFTER all relevant data has been
gathered, shown to the user, given a chance to be changed, and the user has explicitly
confirmed the insert. Only then call `insert_client` with exactly the confirmed
values, and report the created client back to the user.

Never call `insert_client` earlier in the conversation, and never call it on behalf
of an unconfirmed or partially gathered set of data.
