---
aliases: [Decision Log]
tags: [casa, decisions]
---
# Decision log

[[Home]] · [[prd|PRD]] · [[ideas|Ideas]]

Key product and technical decisions, newest at the bottom. Each one says what was decided and why. The [[prd|PRD]] holds the full detail; this log is the quick history.

## October 12, 2026: planning
- **Purpose:** a hobby and learning project and possible portfolio piece, not a business. Success means I use it at home; friends trying it is a bonus.
- **Audience:** me and friends first, beginners maybe later.
- **Core v1 features:** bar cart, "what can I make now," favorites, and "one more ingredient unlocks X." Unlock is the differentiator and the logic is close to Make Now, so it went into v1.
- **Matching is "smart":** generic substitutions allowed and garnishes ignored. Strict matching feels broken in practice.
- **Adding items is manual search for v1.** Barcode and photo scanning come later. Photo recognition is the riskiest part, and manual search is the base scanning would need anyway.
- **Quantities use Full / Half / Low / Empty, not milliliters.** Nobody logs every pour.
- **Recipes come from a curated starter set** with consistent ingredient names, seeded from public sources. A small clean dataset beats a big messy one.
- **Recipes from my cocktail book are tagged by source.** They stay in a private, git-ignored file because of copyright. Starting with one book, favorites first. Claude formats them; an in-app recipe form comes later.
- **Platform:** a web app on localhost. PWA, hosting and phone install come later.
- **No accounts:** data stays in the browser, with Export / Import as the backup.
- **Budget $0, about an hour a day, no deadline.**
- **Stack:** Vite + React + TypeScript, Zustand, plain CSS with variables, Vitest. It's the mainstream setup Claude Code knows best.
- **Brand: "Atomic Garden."** Mid-century, warm amber, light mode, Righteous and DM Sans fonts, a friendly-host voice. No tiki.
- **Alcohol:** a responsible-drinking note, and a non-alcoholic tag in the data from day one. No age gate while the app is private; it's required before any public launch.
- **Navigation:** four tabs plus a round Home button in the center, from my sketch.
- **Substitutions:** specific beats general (a recipe asking for white rum needs white rum), with an "Allow swaps" override.
- **Low bottles count as owned. Empty bottles don't.**

## October 13, 2026: ingredients and screens
- **`noSwap` flag** on ingredients that look like siblings but aren't interchangeable: sweet, dry and blanc vermouth, the sherries, spiced rum, blue curaçao.
- **noSwap does not block "any of this family".** When a recipe itself says "any vermouth," that wins.
- **Ingredient family fixes:** Campari and Aperol got their own "aperitivo bitter" family so Fernet can't stand in for Campari. Cachaça and genever are now their own families.
- **Only ice, water, sugar and salt are "always on hand."** Simple syrup is a cart item.
- **Screen mockups made** before building, since changing a mockup is cheaper than changing code.
- **The Home button sits level with the other tabs,** not raised.
- **The cart is a list of bottles, not ingredients.** I can own two blanco tequilas, each with an optional name like "Jose Cuervo Especial Silver." Recipes still match on the type.
- **Removed bottles go to "past bottles" with a date** instead of being deleted, so a history feature later loses nothing.
- **Bar Cart sections collapse, and spirits group by family,** so big collections stay organized.
- **Matching takes a set of owned ingredient ids, never bottles,** so bottle features can change without touching matching.

## By October 25, 2026: during the build
- **Tequila and mezcal are separate families,** and the "agave spirit" parent was removed.
- **The PRD gained a "Maybe" list** for ideas to weigh, starting with smarter Unlock counting.
- **The screen mockups were added to `docs/screens/`** so Claude Code can match them.
- **The `docs` folder became an Obsidian vault,** with a [[Home]] page, this log and an [[ideas]] inbox.

## October 25, 2026: Bar Cart matches its mockup
- **Differences fixed** (layout, copy, chip text "Low · refill", first spirit family open, mustard blob); see step 3.6.
- **Kept ours on purpose:** "Running low" sits next to "All" (roadmap 3.5); Tequila and mezcal stay separate families; Liqueurs and Vermouth stay separate sections.

## October 25, 2026: recipe page
- **Steps heading is "Recipe", not "Method"** (the mockup says Method). The "Shaken · Coupe" line still names the technique.

## October 25, 2026: Home
- **"Tonight's pick" on Home is fully random** among the cocktails you can make (not weighted toward favorites). Closes PRD open question 2.

## October 30, 2026: starter set
- **Starter set grown to 60 classics with no new ingredients.** Bramble (needs crème de mûre) and Painkiller (trademarked name) were left out. Recipes use general ingredient ids where the drink allows it, so more of them match a real cart.
- **Egg-white sours use `egg-white-foamer`** (the family top), so aquafaba counts too.

## October 30, 2026: copy and empty states (step 7.1)
- **Settings gets a mustard header shape**, the same one as Bar Cart. It has no mockup, and mustard is the calmest of the brand fills. Every screen's shape now comes from one shared `HeaderBlob` component.
- **Home hides the counts while the cart is empty.** "You can make 0" and "All stocked up" read wrong before any bottles are added, so a first visit sees only the welcome and the link to the Bar Cart.

## October 30, 2026: public portfolio release
- **Free hosting moved up from the Later list.** The app is deployed to GitHub Pages by a GitHub Actions workflow (tests, then build), so recruiters can try it without installing anything. The build only ever has the starter set, since book recipes are git-ignored. PWA and phone install stay on the Later list.
- **A "Try a sample cart" button on the empty Bar Cart** fills the cart with 17 demo bottles (`src/data/sampleCart.ts`), so a visitor sees results in one tap. It shows every level, and sweet vermouth is Empty so Unlock has a clear top suggestion.
- **MIT license**, the usual choice for a portfolio project.
- **CLAUDE.md is no longer published.** It stays on this computer for Claude Code, but it's git-ignored. Older commits still contain it.
