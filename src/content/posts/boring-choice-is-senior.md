---
title: "The boring choice is usually the senior one"
description: "Why I keep choosing deterministic pipelines over agents, and how to tell which problem you actually have."
pubDate: 2026-05-20
tags: ["AI Automation", "Architecture", "n8n"]
draft: false
---

There's a moment in every automation project where someone asks why it isn't an agent. The model could just read everything and decide, the thinking goes. Why hand-wire the steps when you could let it reason?

It's a fair question, and most of the time the answer is: because reasoning is the expensive, unreliable part, and you only want to pay for it where it actually earns its keep.

## Two kinds of problems

Most workflows are not reasoning problems wearing a trenchcoat. They're transformation problems. Something comes in, it gets parsed, enriched, validated, and routed somewhere. Each of those steps has a correct answer that doesn't depend on the model's mood, and the failure modes are the boring ones: a malformed input, a missing field, a duplicate that should have been caught.

For that whole class, an agent is a liability. You've taken a problem with deterministic answers and introduced a component whose entire value proposition is non-determinism. The demo looks magical. The Tuesday-morning behavior is a coin flip.

The genuinely agentic problems are rarer than the hype suggests. They're the ones where the path itself is unknown until you're partway down it, where the next step depends on what the last step turned up in a way you couldn't enumerate in advance.

## The test I actually use

Before reaching for autonomy, I ask: *could I write down the decision tree?* If I can — even if it's large — then it's a pipeline, and the model's job is narrow. Parse this. Classify that. Generate copy in this voice. The orchestration does the thinking; the model does the language.

If I genuinely can't write down the tree, that's the signal that reasoning is load-bearing, and an agent might be worth the cost and the supervision it demands.

The skill isn't building agents. Plenty of people can wire up an agent. The skill is knowing when *not* to — and being willing to ship the boring version that someone trusts on a Tuesday.
