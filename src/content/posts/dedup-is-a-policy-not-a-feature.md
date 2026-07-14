---
title: "Dedup is a policy, not a feature"
description: "A CRM hygiene system that catches duplicate records before they're created, not after, and why 'merge duplicates' is the wrong problem to solve."
pubDate: 2026-08-18
tags: ["n8n", "AI Automation", "RevOps", "Architecture"]
draft: false
---

Every CRM fills up with duplicate records eventually, and every team eventually buys or builds something to clean them up. That's fixing the wrong problem. By the time you're merging two records you've already split the activity history across both, pointed some automation at whichever one it grabbed first, and maybe pinged two reps about the same account. Merging is triage after the injury. The fix is not creating the duplicate in the first place.

## Where the check has to sit

A hygiene bot on a nightly schedule that scans for dupes and flags them is better than nothing, but it's still cleanup. Anything created between two runs has already done its damage during the day: a second sequence enrolling the same contact, a second routing notification, a second pile of notes fragmenting one account's history across two records.

The version that works runs at the moment of creation. Inline, before the record gets written, inside every workflow that could create one. Lead import, manual entry, an integration sync, an enrichment step that hands back a "new" contact who already exists under a slightly different email. Every path that writes a record gets the same gate in front of it.

## "Duplicate" is harder than it sounds

This is where most of these get too simple. Exact-match on email address catches the easy ones and misses everything interesting. The same person with a work email and a personal one. A company with a legal suffix on one record and not the other. Someone who changed jobs and is now a genuinely separate record at a different company.

A check worth having runs fuzzy matching across a few fields, name, domain, phone, company, and produces a confidence score instead of a yes or no. High confidence gets blocked automatically. Middling confidence gets handed to a person to confirm rather than auto-merged, because a wrong automatic merge is worse than a duplicate. It can fold two different people's histories into one record, and that is much harder to spot and unpick later than a duplicate sitting there waiting to be flagged.

## Block it, don't report it

A dashboard listing duplicates for someone to review later is a report, and a report doesn't stop the next one from being made. Reports that grow faster than anyone can act on them get ignored inside a month, which is the same trust problem every noisy alert eventually runs into. The version worth building steps in at the write itself. A new record that fuzzy-matches an existing one at high confidence gets folded into that record's pipeline instead of created fresh, automatically, by the same workflow that would otherwise have made the duplicate.

## What you'll be maintaining

Fuzzy thresholds drift the way any classifier does. Too loose and it starts blocking distinct people who happen to share a common name in the same industry. Too tight and duplicates slip through anyway. Same deal as any signal system: it wants a periodic look, not a one-time calibration and done.

The nastier failure is upstream of all this. An integration that writes records through an API path that never touches your workflow gate. Any hygiene logic that lives inside specific workflows is only as complete as its coverage of every way a record can get into the CRM, including the paths nobody remembers exist until a bulk import six months later turns one up.
