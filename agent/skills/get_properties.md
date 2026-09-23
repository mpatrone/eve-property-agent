---
description: Use when a user wants to see or list their active property listings.
---

# get_properties

Follow this procedure whenever a user asks to see, list, or review their properties
or listings.

## 1. Clarify what they need

Confirm the user wants their own active listings (that is what this tool returns —
properties listed by the current agent whose status is not `sold`, i.e. `available`
or `under_offer`). No filters or extra data are needed from the user; the tool takes
no input. If they asked for sold properties, another agent's listings, or everything
in the database, tell them this tool cannot return those.

## 2. Run the query

Call `get_properties`. Resolve the agent from the current session and return only
that agent's active properties. Do not call any insert tool as part of this flow —
reading never writes.

## 3. Present the results

Show the returned properties clearly, one per entry, including for each:

- address, postcode
- price
- bedrooms, bathrooms
- propertyType
- status
- description (or "none")
- listedAt

Summarize the count (e.g. "You have N active listings"). If the list is empty, say so
plainly rather than implying an error.

## 4. Offer next steps

Ask if the user wants to do anything with these listings — such as adding a new
property (with the `insert_property` procedure, which requires its own gather →
show → confirm flow) or matching them against a client's requirements.
