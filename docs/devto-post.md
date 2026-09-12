---
title: I built a choose-your-own-adventure site where every choice is an AI-generated video
tags: showdev, ai, webdev, nextjs
---

**Live: https://playcyoa.com**

A few weeks ago, AI video crossed a weird threshold: generation became *faster than playback*. Fal's H3 Max (a post-trained MiniMax H3) renders a 5-second clip in under 3 seconds, and Pieter Levels immediately turned it into Infinite Slop — an endless crowd-steered AI livestream that reportedly costs ~$4,000/day to run.

I wanted the same "the video doesn't exist until you choose it" feeling, but for a single player — and at a cost a solo dev can actually afford. So I built PlayCYOA: choose-your-own-adventure stories where every branch plays a real AI-generated scene.

## The trick: most players take the same branches

A 24/7 shared livestream burns money nonstop. A branching story doesn't have to: a depth-3 tree is only 7 clips, generated once (~$0.45 each at MetaSo's ¥0.09/sec pricing), then served from a static directory forever. Ten thousand people can play it for the same $3.

The API is only called when someone writes their *own* premise — and that's where the cost guardrails live:

- **A hard daily generation cap** (currently 30 scenes/day, one env var)
- **Prepaid provider balance** — when it's gone, generation just pauses; the site and all cached stories keep working
- If traffic ever explodes, the expensive action is already the gated action

## Stack

- **Next.js 16** — static genre/story pages for SEO, API routes for the generation proxy
- **MiniMax H3 via MetaSo** — MiniMax-compatible API at roughly 1/6 the official price; the provider is abstracted so I can swap to fal or MiniMax direct with one env var
- **An LLM** for writing the two branch options in custom mode (with static fallbacks when no key is set)
- A small Python script that expands a premise into a branching tree (LLM) and renders every node's clip offline — content production is a batch job, not a runtime dependency

## What I learned

- **Async branching is the sweet spot.** Real-time infinite streams are a rich team's game right now; letting a single user wait ~40s per scene works today and the UX holds up.
- **Continuity is the hard part.** Each clip is generated independently, so characters drift between branches. Framing each scene as a *location change* ("follow the candlelight upstairs") hides most of it — the cut becomes a feature.
- **Video SEO pages are thin on the ground.** The SERP for "AI choose your own adventure" is mostly text-only tools and tiny new sites — felt like an open lane.

If you try it, I'd love to hear where the story continuity breaks for you — that's the thing I'm iterating on next.
