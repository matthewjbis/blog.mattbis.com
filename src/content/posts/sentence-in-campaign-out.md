---
title: "Sentence in, campaign out"
description: "A production system that turns a plain-English targeting description into a live, deduplicated outbound sequence, and the one architectural call that made it trustworthy."
pubDate: 2026-06-16
tags: ["n8n", "AI Automation", "RevOps", "Architecture"]
draft: false
---

You type a sentence. Something like "reach out to VP-level ops leaders at industrial manufacturers with 200 to 1,000 employees who haven't heard from us in 90 days." A few minutes later there's a deduplicated, enriched outbound sequence live in the CRM, and nobody opened a spreadsheet to get there.

That's the demo. I want to talk about the part underneath it, because the demo is the easy 20% and the thing that makes it safe to actually run is the other 80%.

## What runs when you hit enter

I built this as a chain of discrete steps, not one prompt doing everything. In order:

The sentence gets parsed into structured criteria. Title level, industry, size band, geography, how recently we've touched them.

Matching prospects get pulled and enriched against the data I already have.

Every candidate gets checked against the CRM before anything else happens. Existing contacts, open opportunities, recent conversations. If they're already in play, they're out.

Only then does a model write the sequence, in a brand voice I keep in a reference file rather than re-describing in the prompt every time.

The draft gets a pass to catch invented claims before it goes anywhere.

The sequence gets created and switched on in the CRM. Not exported to a CSV, not parked in a review queue. It's running.

## Why I didn't make it an agent

The 2026 way to build this is to hand a model the sentence and let it figure out the rest. Search, enrich, write, send, in whatever order it decides. That version is more impressive to watch. It's also the one I wouldn't put anywhere near a live CRM, because "decide what to do next" is exactly the step I don't want improvised when the last link in the chain writes to production.

So the model's job is small on purpose. It reads language and it writes language. Everything else, the order of operations, the gate that stops a bad batch, the dedup check, is fixed logic that behaves the same on a Tuesday as it did the day I built it. I gave up the impressive version to get the one people trust. That trade is most of what this job is.

## Dedup goes first, not last

The obvious place to strip duplicates is at the end. Build the campaign, then filter out anyone who shouldn't be in it. I did it the other way around.

If you dedup after generation, you've already paid to write copy for people who were never going to be contacted, and you've added a step where one filtering bug fires a duplicate touch at someone a colleague is mid-deal with. Checking against live CRM state before a single line of copy exists is uglier on the architecture diagram, and it's the reason the reps stopped re-checking the system's output by hand.

## Where it actually falls down

The parse step is the weak link. Give it something genuinely ambiguous, "companies like our best customers," with no definition of "like" anywhere in the system, and it produces criteria that look reasonable and target the wrong list. A smarter parser doesn't fix that. A tighter input contract does: when confidence on any field is low, the system asks a question instead of guessing. A wrong guess that ships without anyone noticing costs a lot more than a question that takes ten seconds to answer.

The other one I can't fully solve is stale enrichment. Someone changed jobs last week, a company got acquired and it hasn't propagated yet. There's no clever fix for that. It's why a human still eyeballs the first batch out of any new segment before I let it run on its own.

## Why this ports to someone else's stack

Nothing here is specific to one company except three things: the CRM, the enrichment source, and the voice file. The parser, the dedup gate, the self-check, the ordering, all of it moves as-is. That's what a productized system actually looks like. A fixed spine with a few swappable inputs, not a from-scratch build every time someone new signs on.
