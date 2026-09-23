---
description: Use when a user wants to generate a marketing description for a property, based on its postcode and the surrounding area.
---

# generate_property_description

Follow this procedure whenever a user asks for a property description, listing
blurb, or marketing copy for a property.

## 1. Identify the property

Establish which property the description is for and get its postcode:

- If the user named or addressed a property, call `get_properties` and match it to
  one of the current agent's listings, taking the `postcode` (and address, price,
  bedrooms, bathrooms, propertyType, and description already on file) from that
  entry.
- If the user gave the postcode directly, use it as given.
- If there is no match or the mention is ambiguous, ask which property they mean.
  Never guess a postcode.

Collect the property's own facts too (address, price, bedrooms, bathrooms, type,
existing description) — either from `get_properties` or from the user — because the
generated description must describe the actual property.

## 2. Research the area with the Exa search tool

Search the web for information about the area using the Exa MCP connection's search
tool — `exa__web_search_exa` (discovered through `connection_search`; the user may
call it `web_search_exa` or "the exa search tool"). Search based on the property's
postcode, and run targeted queries covering at least:

- **Nearest public transport** — train, tram, tube, and bus stations/stops serving
  the postcode, and what lines or routes they carry.
- **Schools** — primary and secondary schools (and nurseries or colleges if found)
  near the postcode, naming them.
- **Shops** — supermarkets, high-street shops, and local markets around the area.
- **Other interesting or desirable attractions** — parks, restaurants, museums,
  sports venues, theatres, waterfronts, or other notable highlights of the area.

One broad query for the postcode plus one query per category works well. Use only
what the searches return; never invent a landmark, school, station, or distance.

## 3. Draft the description

Write a clear, appealing marketing description that combines:

- the property's own facts (type, bedrooms, bathrooms, price context, any existing
  description details), and
- the area research from step 2 — mentioning specific nearby transport, schools,
  shops, and attractions.

Keep it honest and grounded: only state things the property facts or the search
results support, prefer "near" or "close to" over invented distances, and do not
claim a specific journey time, catchment area, or Ofsted/rating unless a result
stated it. Roughly 100–200 words unless the user asked for another length, in the
tone they requested.

## 4. Show the draft and let the user change it

Always present the draft to the user before treating it as final. Explicitly invite
edits — length, tone, which area highlights to include or drop, or corrections to
any fact. Revise and re-show the full text after each change until the user is happy
with it.

If the user wants the description saved to the database, note that this requires a
write: follow that tool's own procedure (its own gather → show → confirm gate) and
get explicit confirmation before any write happens. Generating a description on its
own never writes anything.
