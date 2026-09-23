---
description: Use when a user wants to add a new property listing to the database.
---

# insert_property

Follow this procedure whenever a user asks to add, create, or list a new property.

## 1. Gather all relevant data first

Collect every field the `insert_property` tool requires before doing anything else:

- address
- postcode
- price (integer, positive)
- bedrooms (integer, non-negative)
- bathrooms (integer, non-negative)
- propertyType (one of: detached, semi-detached, terraced, flat, bungalow, cottage, other)
- status (one of: sold, available, under_offer)
- description (optional)

Ask follow-up questions until every required field is filled in and you are confident
you have understood the user's intent correctly. Never invent values — if something is
missing or ambiguous, ask. If no description is provided for the proprety, generate one by using the `generate_property_description` skill.

## 2. Show the collected data

Once ALL relevant data is gathered, present the complete set of values back to the
user in a clear, readable summary (a field-by-field list works well), together with
what will be inserted. Explicitly invite the user to make changes: tell them they can
correct or update any field before anything is written.

## 3. Wait for changes

If the user asks to change any value, apply the change and show the full updated
summary again. Repeat this cycle until the user says the data is correct as shown.

## 4. Get explicit confirmation

The user MUST always confirm whether they want to continue with inserting the new
property into the database. Ask a direct yes/no question such as "Shall I insert this
property now?" and stop and wait for their answer.

- If the user does not clearly confirm, do NOT insert. Ask again or stop.
- If the user says no or wants to modify something, return to step 2 or 3.

## 5. Insert only after confirmation

The `insert_property` tool must ONLY be called AFTER all relevant data has been
gathered, shown to the user, given a chance to be changed, and the user has explicitly
confirmed the insert. Only then call `insert_property` with exactly the confirmed
values, and report the created property back to the user.

Never call `insert_property` earlier in the conversation, and never call it on behalf
of an unconfirmed or partially gathered set of data.
