---
title: "The signal, checked, before the rep ever notices"
description: "How a buying-signal detection system decides what NOT to escalate, and the routing and verification logic that sits between a raw signal and a rep's inbox."
pubDate: 2026-06-23
tags: ["n8n", "AI Automation", "RevOps", "Architecture"]
draft: false
---

I've got an earlier post about why a signal-detection system lives or dies on what it refuses to surface. This is the other half of that. Once a signal clears the bar and gets flagged, what happens to it before a human sees it? That middle layer, the routing, is where most of these systems fall apart, and it's the part nobody puts in the demo.

## A flag isn't the whole story

Every high-value signal looks identical from the outside. Someone did a thing that suggests interest. Plenty of those are noise in a nicer outfit. A current customer poking at a feature they already pay for. An account a colleague has been working for a month. The same person tripping the same tag twice because they opened the email on their phone and then again on their laptop.

None of that is a detection failure. It's missing context, and the context has to get attached before the signal reaches a person, not after.

## The order things happen in

A tag fires. Form fill, content download, pricing page visit, whatever the source is.

Before anything else, the system reads the CRM. Is there an open opportunity here already? Did this account buy something in the last N days? Has this exact product already come up in a logged call? That check is a hard gate, and it runs first.

Whatever survives the gate gets a model pass, and the model doesn't get to freewrite. It returns one of three verdicts, net-new interest, re-engagement, or false positive, plus the evidence it used to decide.

Only the genuinely net-new ones get enriched with company and contact detail.

Then it goes to the rep who owns the account. Not a shared queue, not a round robin. The owner.

## Why the CRM check comes first

I could hand the model everything at once, the signal, the history, the account notes, and let it make one judgment call. It would be slower, it would cost more per signal, and worst of all every decision would be a black box I'd have to trust in full.

Splitting it in two fixes both problems. The cheap, fast, readable gate runs first, so I only spend the expensive reasoning on signals that already passed a filter I can inspect. And when something goes wrong, I know which half to look at. Either the history check let something through it shouldn't have, or the model misjudged it. I'm not re-reading a full transcript trying to reverse-engineer where the logic wandered off.

## The failure that costs real money

A missed signal isn't the expensive mistake here. A false alarm is. A rep gets pinged about an account someone else already owns, or worse, one that churned last quarter and they didn't know. Do that once and that rep starts hand-verifying everything the system sends them, and now I've built an alerting tool that adds work instead of removing it. That's worse than shipping nothing at all.

It's also the whole reason a system like this gets to sit next to a CRM in the first place. Not because it's fast. Because it's careful, and careful is the thing that earns it a seat.

## What I keep having to maintain

The verdict step is only as good as the definition of "net-new" for a specific business, and that definition doesn't hold still. A new product tier, a bundle change, a reseller arrangement, any of them can invalidate an assumption baked into the prompt without anyone noticing, while the system keeps humming along being confidently wrong. So I review a sample of verdicts on a schedule. These things are never finished. They get maintained or they rot.
