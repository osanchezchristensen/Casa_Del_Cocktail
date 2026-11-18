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

## November 1, 2026: v1.1 onboarding
- **First-run onboarding is v1.1**, the first step after v1. Rules in PRD section 13, build steps in roadmap Phase 8.
- **Screen 5 uses tap-to-pick pills with no bottle names**, to keep first setup under a minute. Picks go on as Full; names and levels can be changed later on the Bar Cart.
- **Existing users skip it.** The store migration sets `onboardingDone` to true when there are already bottles or favorites, and older backups import as done.
- **Screen 5 groups categories into five sections** (Spirits; Liqueurs & vermouth; Bitters; Juices, syrups & mixers; Wine, beer & more), following the mockup instead of one section per category: five short lists are quicker to scan. The groups and their common picks live in `src/logic/onboarding.ts`.

## November 1, 2026: onboarding mockup check (step 8.3)
- **Kept on purpose:** screen 2 uses the real `LevelChip` (bolder than the mockup) so the preview looks like the Bar Cart; pills use full ingredient names ("Maraschino liqueur"); screen 5 shows 10 common picks per section; the screen 1 heading uses the shared 32px size (mockup 34px); screen 5 adds "Nothing picked yet." with a disabled button and a no-results message, which the mockup does not show.
- **"Replay the tour" lives in the Settings About card** (Settings has no mockup). It keeps `onboardingDone` true, so leaving the replay halfway never traps you in the tour.

## November 1, 2026: age gate
- **An age question ("Are you 21 or older?") now comes right after the welcome screen**, because the app is public on GitHub Pages and the PRD made a gate a must before any public launch. It replaces the earlier rule that a gate would come before onboarding: the welcome screen says what the app is first, then asks.
- **21, the US drinking age.**
- **Nothing gets around it:** Skip on the welcome screen still leads to the question before Home, and direct links to any screen are sent there first. "No" isn't saved, which is normal for a self-declared gate.
- **Everyone is asked once,** including carts saved before the update. There are no outside users yet, so the extra tap only costs the owner.
- **No mockup.** The screen reuses the tour layout and brand styles, with an outlined "No" button the same size as "Yes".

## November 16, 2026: v1.2 plan
- **v1.2 combines bottle history and the non-alcoholic filter with mocktails** (Later items 3 and 5), because both are small and built on data the app already keeps (`pastBottles`, the `non-alcoholic` tag and the `alcoholic` flag). No data shape changes.
- **Non-alcoholic means the recipe has the tag**, as the PRD data section already said. A data test makes sure tagged recipes use no alcoholic ingredients.
- **No mockups for v1.2.** The Past bottles screen reuses the Bar Cart row style and the filter reuses the Make Now filter buttons.
- **Smarter Unlock counting moves from Maybe to the Later list, next after v1.2**, because it gives better buying advice than today's count.

## November 16, 2026: v1.2 brand check (step 9.3)
- **The Non-alcoholic button is teal**, like every other filter, with a check mark when it's on. Avocado is kept for "you can make this," so the button can't be mistaken for a status.
- **"Add again" on Past bottles keeps a Walnut outline**, not the brand kit's teal for secondary buttons, to match "Try a sample cart" and the age question's "No," which already use it.
- **Make Now says "drinks" instead of "cocktails" while the Non-alcoholic filter is on.**

## November 16, 2026: smarter Unlock counting (v1.3)
- **Unlock tests every bottle you don't have** instead of crediting the ingredient a recipe names, so one bottle of London dry gin counts for "gin" recipes too. This gives truer "+N" numbers and better buying advice.
- **Near-identical bottles are handled by hiding repeats**, not by grouping cards by family: a suggestion is hidden when one ranked above it already unlocks all its recipes. It keeps the Unlock screen and "I bought it" exactly as they are. Grouping by family stays an option if repeats still crowd the list.
- **On a tie, the more general ingredient wins** ("gin" before "London dry gin"), because "any gin" is the easier thing to buy.
- **Changed in step 10.1, after trying it on the sample cart:** ties first go to the bottle that needs fewer swaps as a stand-in, and general-first only applies inside a family. Without that, Unlock suggested "any amaro" for a Paper Plane instead of Amaro Nonino, and every family top crowded out specific bottles like dry vermouth and cognac.

## November 16, 2026: v1.3 release check (step 10.2)
- **Checked on the sample cart only.** The before-and-after comparison on my own cart was skipped by choice; the sample cart, with swaps off and on, already showed the tie-rule problems that step 10.1 fixed.

## November 17, 2026: motion planned (v1.4)
- **Motion is warm and a little bouncy, never flashy** ([[motion|Motion guide]]). It's for moments of doing or reward only, so the app feels alive without slowing anyone down.
- **Only rewards and button releases get a springy overshoot.** Everything else eases calmly, so the bounce stays special.
- **We follow the device's reduce-motion setting, with no switch in Settings.** The device setting already says what the person wants; a second switch would be one more thing to explain.
- **Sound is left out for now.** If it comes back, it's off by default with its own Settings switch, separate from reduce motion.

## November 17, 2026: Party Mode planned
- **Party Mode is menu first:** the host picks drinks, and the app works out what is still needed.
- **Guests join by browser link with a name only and a 21+ checkbox.** Accounts and the installed app come later.
- **Guests see ingredient names only,** never levels, bottle names, the host's cart or name.
- **Guests see every menu drink,** with the unready ones marked "Coming once X arrives". This replaced an earlier plan to hide them.
- **Menus are live while planning and lock on Finalize.** The link expires 7 days after the party date and the data is deleted.
- **Book recipes are excluded from party menus** because they are private.
- **The printed menu is A4,** in color and in a simplified black-and-white version.
- **The party reuses the existing matching logic** with the host's chosen ingredients plus guest claims. There are no new matching rules.
- **The unlock count-and-burst plays once per open,** and again after adding a bottle that opens new recipes.

## November 18, 2026: motion tokens (step M.1)
- **Each `--motion-*` token holds a time and a curve together** (for example `90ms var(--ease-out)`), so a screen can write `transition: transform var(--motion-press)`. If a property ever needs only the time, split the token then.
- **The tokens live in `src/styles/global.css`** next to the brand tokens; the reduce-motion helper is `prefersReducedMotion` in `src/logic/motion.ts`, for animations driven by code. CSS animations use `@media (prefers-reduced-motion: reduce)` instead.
