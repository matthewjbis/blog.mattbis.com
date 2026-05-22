---
title: "A classifier that fires on everything is just noise wearing a costume"
description: "Tuning a signal-detection system around what it chooses *not* to surface — and why precision beats recall in any tool a human has to trust."
pubDate: 2026-05-12
tags: ["AI Automation", "Classification", "RevOps"]
draft: false
---

The first version of any signal-detection system is too eager. You build something to flag the interesting cases, you point it at real data, and it flags everything. Technically it's working. Practically it's dead, because a team learns to ignore a noisy alert within about a week, and once they've learned that, you don't get their attention back.

## Recall feels good and lies to you

It's tempting to optimize for catching everything. Missing a real signal feels like the expensive failure, so you loosen thresholds until nothing slips through. The problem is that recall and trust trade against each other. Every false positive spends a little of the team's willingness to look. Spend enough and the tool is worthless no matter how many true positives it also surfaces.

So the whole system ends up tuned around what it chooses *not* to surface. The interesting design work isn't in detection — detection is easy. It's in restraint.

## Precision is the product

A flag a human trusts is worth more than ten the model finds interesting. That sounds obvious written down, but it cuts against how most of these systems get built, because the impressive-looking metric is volume and the valuable one is quietness.

Concretely, that means tight thresholds, conservative defaults, and a bias toward silence when the signal is ambiguous. It means resisting the urge to let the model "decide" in the gray zone, because the gray zone is exactly where false positives breed. Deterministic classification with strict cutoffs beats a clever model with opinions, because the clever model's mistakes are the ones that erode trust fastest.

The cleverness, when it works, is invisible. Nobody notices the alerts that didn't fire. That's the point.
