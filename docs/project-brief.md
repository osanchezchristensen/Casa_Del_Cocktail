---
aliases: [Project Brief]
tags: [casa, brief]
---
# Casa Del Cocktail: Project Brief

[[Home]] · [[prd|PRD]] · [[brand-kit|Brand Kit]] · [[roadmap|Roadmap]]

**Version:** 1.1 (draft, adds recipes from my own books) | **Date:** October 12, 2026 | **Owner:** [Your name]

## One-line summary

Casa Del Cocktail is a virtual bar cart. You tell it what's on your shelf, and it tells you which cocktails you can make right now and which single bottle would unlock the most new ones.

## Why this exists

Most people with a home bar cart own a handful of bottles and keep making the same two drinks. Existing apps tend to start from the recipe ("pick a cocktail"), not from the bottles you own. This project starts from the cart and works outward.

It is also a hobby and learning project: a chance to build a complete app with Claude Code and to end up with something worth showing in a portfolio.

## Goals

1. **Primary:** Build a working app that I actually use at my own bar cart.
2. **Learning:** Learn to build with Claude Code, reviewing and steering the code rather than only copying it.
3. **Stretch:** Share it with friends, and possibly show it in a portfolio.
4. **Out of scope for now:** Revenue, an app store release, or a large public audience.

**Success in 3 months:** I use it at home and it works. A few friends trying it is a bonus.

## Audience

- **Now:** Me, then friends who want to try it.
- **Later (possible):** Beginners starting their first bar cart, who need to know what to make and what to buy next.

## How it's used

- **Main moment:** Standing at the bar cart, asking "what can I make right now?"
- **Second moment:** Browsing, asking "if I buy this one bottle, how many new cocktails can I make?"

## Version 1 scope

**In:**
- Virtual bar cart with manual search to add items
- Quick-add onboarding (type-ahead search, multi-select, category checklists) so setting up 40 items takes minutes, not an evening
- "Cocktails I can make now" with smart matching: generic substitutions allowed (any gin works for "gin"), garnishes ignored
- "One more ingredient unlocks X cocktails"
- Favorite cocktails
- Recipes from my own cocktail books, each tagged with its source (book title, author, page), plus a filter to show only one book's recipes. Book recipes are bulk-loaded from a file I prepare with Claude's help (see Key decisions)
- Quantity levels per item: Full / Half / Low / Empty, with a refill flag on Low
- Export / Import my cart (a backup button, since data lives in the browser)
- A short responsible-drinking note

**Designed for, built later:**
- Mocktail support (a "non-alcoholic" tag is in the data from day one)

**Later versions:**
- Barcode scanning, then photo recognition (with a confirm step on every scan)
- Accounts and syncing across devices
- Access from anywhere (free hosting)
- Installable phone app (PWA) and offline mode
- An in-app "Add my own recipe" form (first in line after v1)
- Snapping a photo of a book page to import a recipe
- Importing recipes from a public API
- Age gate (if the app ever goes public)

## Key decisions so far

| Area | Decision |
|---|---|
| Platform | Web app (PWA features later) |
| Stack | Vite + React + TypeScript, runs entirely in the browser, no server |
| Data storage | On the device, no accounts |
| Recipes | Curated starter set of ~50-100 with consistent ingredient names, seeded from public sources (licenses checked), tagged "Casa starter set" |
| Book recipes | Every recipe has a source tag. Book recipes are typed or pasted into Claude, which converts them into the app's recipe format using the app's ingredient names. They live in a separate private file that is never published |
| Where it runs | My computer (localhost) for now |
| Budget | $0 |
| Time | About 1 hour a day, no deadline (roughly 2-3 weeks to a working core loop) |

## Brand direction (to be developed in the brand kit)

- **Feel:** Mid-century and retro. Warm amber tones, organic natural shapes, cozy and nostalgic. Simple, not cheesy.
- **Voice:** A friendly host: calm, warm, and lightly witty, kept subtle.
- **Name:** A play on words. Logo and tone get developed later.

## Main risks

1. **Ingredient matching.** Recipes and bottles must map to consistent generic ingredients, or "what can I make" gives wrong answers. Mitigation: a small, clean, hand-curated dataset.
2. **Scope creep.** Scanning and photo recognition are tempting but hard. Mitigation: they stay out of v1.
3. **Data loss.** Browser storage can be cleared. Mitigation: Export / Import in v1.
4. **Recipe data licensing.** Public datasets have varying terms. Mitigation: check licenses before seeding, and keep the recipe file replaceable.
5. **Book recipes are copyrighted.** Using them privately is fine. Publishing them in a public GitHub repo or a shared app likely isn't, especially the written instructions and notes. Mitigation: keep book recipes in a private file excluded from git, so the portfolio version ships with only the starter set. (Not legal advice.)
6. **Entering book recipes is slow.** Typing hundreds of recipes would stall the project. Mitigation: add favorites first, a handful at a time, using Claude to do the formatting.

## Open questions

- Which public recipe sources will seed the starter set, and what are their licenses?
- How should the ingredient hierarchy work (for example, bourbon is a whiskey, is a spirit)?
- What are the exact rules for "smart" substitution (can any rum stand in for "white rum"?)?
- Which books come first, and roughly how many recipes from each?
- When a book recipe calls for an ingredient that isn't in the app's list yet (a house-made syrup, say), how is it added?

## Next documents

1. Brand kit
2. PRD (user stories, MVP vs later, screens, data, technical considerations)
3. MVP roadmap in small steps
4. Updated CLAUDE.md for Claude Code
