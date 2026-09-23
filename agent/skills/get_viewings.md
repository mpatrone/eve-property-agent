---
description: Use when a user wants to see their viewings scheduled for a particular date.
---

# get_viewings

Follow this procedure whenever a user asks about their viewings, diary, or schedule
for a day.

## 1. Get the date

Ask which date the agent wants if they have not said — a day, e.g. "today",
"tomorrow", or "2026-09-23". Convert relative words like "today" using the current
date and show the absolute date back in the summary so a wrong interpretation is
visible. No other input is needed; the tool always returns only the current agent's
own viewings.

## 2. Run the query

Call `get_viewings` with that date. It returns every viewing assigned to the current
agent whose `scheduledAt` falls within that day, joined with the client's name and
contact information and the property's address. Do not call any insert tool as part
of this flow — reading never writes.

## 3. Present the results

List each viewing chronologically (earliest first), showing for each:

- scheduledAt (time of day)
- client name and contact (or "no contact on file")
- property address (and postcode)
- status
- notes (or "none")

Summarize the count (e.g. "You have N viewings on <date>"). If there are none, say
so plainly rather than implying an error, and offer the date the user might have
meant if their request was ambiguous.

## 4. Offer next steps

Ask if the user wants to do anything next — such as booking another viewing (with
the `insert_viewing` procedure, which requires resolving the client and property via
`get_clients`/`get_properties` and its own gather → show → confirm flow), or checking
a different date.
