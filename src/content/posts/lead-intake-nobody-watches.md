---
title: "Lead intake nobody has to watch"
description: "A two-stage kickoff-and-worker pattern for lead import, and why splitting 'accept the lead' from 'process the lead' is the difference between a system that scales and one that falls over during a spike."
pubDate: 2026-08-04
tags: ["n8n", "AI Automation", "RevOps", "Architecture"]
draft: false
---

Lead intake seems like a solved problem right up until the day volume spikes. A form fill here, a list upload there, all fine. Then a webinar dumps four hundred records in one minute and the workflow that handled the first two falls over, because it was built to treat "a lead showed up" and "a lead is fully processed" as the same event. They aren't.

## Two workflows, one job each

The version that survives real volume splits in two.

The first one I call the kickoff. It catches the incoming lead from wherever it came, checks the bare minimum (is this actually a lead, does it have enough on it to be worth anything), and drops it on a queue. That's the whole job. No enrichment, no dedup, no writing to the CRM. Catch it fast and don't lose it.

The second one is the worker. It pulls off the queue and does the real work: dedup against the CRM, enrichment, routing, the write. It runs at whatever pace the downstream systems can actually sustain, and it doesn't care whether one lead came in this minute or four hundred did.

## Why bother splitting them

A single workflow ties how fast you can accept leads to your slowest downstream step. Say enrichment takes eight seconds a record and four hundred land at once. Either the thing queues internally somewhere you can't see it, or it starts timing out and dropping records, and you find out on Thursday when someone asks why the webinar list never got a single call.

Splitting kickoff from worker means accepting a lead never waits on processing one. The queue absorbs the spike. Four hundred records get accepted instantly and worked through at a rate the CRM can handle, instead of the whole line slowing down to match its worst moment.

It also puts the failure where you can see it. If enrichment breaks, the worker's error rate tells you right away, and the queue just holds everything safely in the meantime instead of losing leads halfway down the pipe.

## Dedup lives in the worker

I know the instinct is to check for duplicates at the front door, before anything hits the queue, and reject on the spot. Don't. Accurate dedup needs current CRM state, and current state is the one thing you can't count on during a spike, because the CRM is very likely under load from the same event that's driving your lead volume in the first place.

So dedup goes in the worker, against live state, at the worker's own pace. Deduping at the kickoff is a race condition that looks fine in testing and blows up on your busiest day.

## The ways this bites you

The queue turns into your single point of failure the moment you stop watching it. A worker that silently stops pulling, an expired credential, a downstream API that started rate-limiting it, looks completely fine from the outside. Leads are still being accepted. They're just stacking up and going nowhere. A workflow-error alert won't catch this, because nothing is erroring. What you want is an alert on queue depth.

The other one is a kickoff validation rule that's too strict and throws out real leads that don't fit a schema you assumed. A lead from a new source with slightly different field names, say. The kickoff should let anything ambiguous through and leave the worker to sort it out. Better to accept a questionable lead and drop it later than to lose a good one before anyone knew it existed.
