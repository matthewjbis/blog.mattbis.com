---
title: "Answer only what you can cite"
description: "Building an internal knowledge chatbot on Google Drive and a vector store, and why the retrieval layer, not the model, is where this kind of system actually lives or dies."
pubDate: 2026-07-07
tags: ["n8n", "AI Automation", "Architecture", "RAG"]
draft: false
---

A knowledge chatbot is an easy thing to demo and a hard thing to run, and almost the entire gap between those two is one layer nobody puts in the demo: retrieval.

## The shape of it

It's a retrieval-augmented setup wired through n8n. Source docs live in Google Drive, get chunked and embedded into a vector store, and every question routes through retrieval before it reaches the model. The model never answers from what it happens to already know. It answers from what retrieval hands it and nothing else. That restriction is the whole reason the thing is trustworthy.

## The way RAG fails that nobody shows you

The failure you don't see in a demo is a smooth, confident answer built on the wrong retrieved chunk. The model has no idea it's wrong. It sounds exactly as sure of a bad answer as a good one, because how fluent an answer reads and whether it's correct are two different things, and the model only controls the first.

That's why the work in a system like this belongs in grounding and citation, not in being clever with the generation prompt. A model that answers well from good context is not hard to build. Reliably handing it good context is the actual engineering, and that's a retrieval and chunking problem, not a language one.

## What makes retrieval trustworthy

Chunk along the document's real structure. Split by a fixed character count and a chunk can open mid-thought, missing the clause that made the original sentence true. Respect headers, paragraphs, and tables, and the retrieved context is wrong far less often.

Cite back to the source, not just the answer. Every response should trace to a document, ideally a section. That isn't there to make users feel good about it. It's how you catch bad retrieval before a user does. If the citation doesn't actually back the claim, that's a retrieval bug you can now see, instead of one buried under confident prose.

Give it a real way to say "I don't know." The system has to be able to report that nothing in the source answers the question, and it needs to do that more often than feels comfortable. A chatbot that always has an answer is one that's occasionally inventing them.

## Where it breaks over time

Document updates are the recurring one. The source in Drive changes and the vector store has no idea until it gets re-indexed. With no scheduled or triggered re-embed, the bot keeps citing a version that's already stale, and because the citation still lands on a real document, it looks right even after the content moved on underneath it.

The other is scope. Build a knowledge base for one team's docs, ask it something adjacent but out of scope, and it'll usually pull the nearest-sounding chunk rather than admit it has nothing. Retrieval returns the closest match by design. It doesn't know the difference between the right answer and the least-wrong thing it could find.
