---
aliases: [Roadmap]
tags: [casa, roadmap]
---
# Casa Del Cocktail: MVP Roadmap

[[Home]] · [[prd|PRD]] · [[brand-kit|Brand Kit]] · [[screens/README|Screens]]

**Version:** 0.1 | **Date:** October 12, 2026

This roadmap breaks v1 into **about 27 small steps**. Each step is sized for **one session of about an hour**. Some will spill over; that's normal. At one session a day, expect:

- **Milestone B (core loop working):** around week 3
- **v1 complete:** around weeks 5-6, with buffer

There's no deadline. If a step takes three sessions, it takes three sessions.

---

## How every session works

1. **Start in Plan Mode.** Paste the step's prompt into Claude Code and ask for a plan first. Read it. If something is unclear, ask before it writes code.
2. **Let it build.** Approve the plan and let Claude Code make the changes.
3. **Run it and look.** Check the step's "Done when" list yourself in the browser. Don't take "it works" on faith.
4. **Ask for an explanation.** "Explain what you changed and why, like I'm new to React." This is the learning part. Skim the main file it touched.
5. **Commit.** "Commit this with a clear message." One step = one commit, so you can always go back.

**Ground rules**
- One step per session. If you finish early, stop or polish; don't start the next big thing tired.
- Stuck for more than 20 minutes on the same error? Ask Claude Code to undo back to the last commit and try a different approach.
- New idea mid-build? Write it in the PRD's "Later" list and keep going.
- Keep the app running (`npm run dev`) while you work so you see changes live.

---

## Phase 0: Setup (2 sessions)

### 0.1 Install the tools and create the repo
**You do (with Claude's help if anything fails):**
- Install **Node.js** (the "LTS" version from nodejs.org) and **Git**, if not already installed
- Install the **Claude Code extension** in VS Code and sign in
- Create a **private** GitHub repo named `casa-del-cocktail` and connect your `Casa_Del_Cocktail` folder to it
- Make sure the `docs` folder (brief, brand kit, PRD, roadmap) is in the project

**Done when:** `node -v` and `git --version` print version numbers in the VS Code terminal, and your docs are visible on GitHub.

### 0.2 Add CLAUDE.md and scaffold the app
**Prompt:**
> Read CLAUDE.md and the files in /docs. Set up a new Vite + React + TypeScript project in this folder without overwriting /docs or CLAUDE.md. Add React Router, Zustand, Lucide icons and Vitest. Make sure `npm run dev` and `npm test` both work. Explain what each new file and folder is for.

**Done when:** the starter page opens at `localhost:5173`, `npm test` runs (even with zero tests), and it's committed.

---

## Phase 1: Foundations (3 sessions)

### 1.1 Brand styles and the navigation shell
**Prompt:**
> Using docs/brand-kit.md, set up global styles: the color palette and fonts as CSS variables, base text styles, and a mobile-first layout that shows as a phone-width column centered on desktop. Then build the bottom navigation from the PRD (section 6): Bar Cart and Make Now on the left, a raised round Home button in the center, Unlock and Favorites on the right. Create empty placeholder pages for all five routes.

**Done when:** you can click between all five screens, the colors and fonts match `brand-preview.html`, and the Home button is round and raised.

### 1.2 Data types and the ingredient list
**Prompt:**
> Following PRD section 8, create TypeScript types for Ingredient, Recipe, RecipeIngredient, CartItem, Favorite and Settings. Then create src/data/ingredients.json with about 150 common home-bar ingredients, organized into the family tree with parentId (for example spirit → rum → white rum). Include basics like ice, water and sugar marked alwaysOnHand.

**You check:** open `ingredients.json` and skim it. Are your bottles in there? Is the family tree sensible? This is the foundation of matching, so it's worth 15 minutes of your attention.

**Done when:** the ingredient list covers everything on your actual cart (add what's missing).

### 1.3 The first 20 starter recipes and a data check
**Prompt:**
> Create src/data/recipes-starter.json with 20 well-known classic cocktails, written in our own words, with source type "starter". Use only ingredient ids from ingredients.json. Then write a test that fails if any recipe uses an ingredient id that doesn't exist, or is missing a source.

**Done when:** `npm test` passes, and you recognize the 20 cocktails.

---

## Phase 2: The matching engine (3 sessions)

No screens yet. This is the brain of the app, built and tested on its own.

### 2.1 "Can I make it?": basic rules
**Before prompting:** write 5 test cases in plain English in a note, for example:
- *I have bourbon, sweet vermouth, Angostura bitters → Manhattan: yes (garnish ignored)*
- *I have dark rum, lime, sugar → Daiquiri (needs white rum): no*
- *My Campari is Empty → Negroni: no*

**Prompt:**
> Create src/logic/matching.ts with a function that decides whether a recipe can be made from a cart, following PRD section 7, rules 1, 2, 5 and 6 (no swaps yet). Keep it free of any React code. Write Vitest tests for these cases: [paste your cases]. Add a few more edge cases of your own and explain them.

**Done when:** all tests pass, and you can explain rule 2 (specific beats general) in your own words.

### 2.2 Swaps and "any of this family"
**Prompt:**
> Extend matching.ts with rules 3, 4 and 7 from PRD section 7: an "allow swaps" option that lets a sibling in the same family fill a specific ingredient, recipe-level anyOfFamily, and no swaps across families. Results must say whether a match is perfect or uses a swap, and which ingredient was swapped for which. Add tests.

**Done when:** tests pass, including "dark rum for white rum works with swaps on" and "rum never replaces gin."

### 2.3 The Unlock calculation
**Prompt:**
> Add a function to matching.ts that, given a cart and all recipes, ranks ingredients the user doesn't own (or has Empty) by how many recipes they would be the only missing required ingredient for, following PRD section 7. Return the top 10 with the list of recipes each unlocks. Respect the allow-swaps option. Add tests.

**Done when:** tests pass, and the results for a small sample cart make intuitive sense to you.

---

## Phase 3: Bar Cart (5 sessions)

### 3.0 Quick fix: level Home button
**Prompt:**
> Update the bottom navigation to match PRD section 6: the round Home button (Amber fill, about 52px) sits level with the other tabs instead of raised above the bar. Change only the nav styles.

**Done when:** the Home button is round and lines up with the other four tabs, and all five tabs still work.

### 3.1 The cart store and bottle list
**Prompt:**
> Following PRD section 8, replace the CartItem type with Bottle (id, ingredientId, optional name, level, addedAt) and add PastBottle (a bottle plus finishedAt). Create a Zustand store for bottles, past bottles, favorites and settings, saved to localStorage with the persist add-on and a version number. Build the Bar Cart screen from PRD section 6: bottle count, sections by category that collapse, spirits grouped by family (each family's top ingredient) that collapse too, and each bottle row showing its name first and its type underneath (or just the type with "Add a bottle name"). Use the empty state copy from the brand kit. Add a temporary "load sample cart" button with a few bottles, including two of the same type.

**Decided:** tequila and mezcal are separate families and show as two groups.

**Done when:** sample bottles show in collapsible sections, spirits are grouped by family, both bottles of the same type show separately, and everything is still there after refreshing the browser.

### 3.2 Add bottles: search and confirm
**Prompt:**
> Build the "Add items" sheet from PRD section 6 with Search mode: accent-insensitive type-ahead search over ingredient names and aliases, select one or more results, then a confirm step ("Add these 2 bottles?") with an optional bottle name field for each pick. Each pick becomes a new bottle at Full. A result I already own says so ("You have 1: Espolòn Blanco"), and picking it adds a second bottle.

**Done when:** you can find "Campari" by typing "camp" and Cachaça by typing "cachaca", a named bottle shows its name first in the cart, and nothing is added until you confirm.

### 3.3 Add bottles: browse by category
**Prompt:**
> Add Browse mode to the Add items sheet: category checklists (spirits, liqueurs, bitters, etc.) with multi-select, types I already own marked with how many bottles I have, using the same confirm step with optional bottle names.

**Done when:** you can add 10 bottles from three categories in one go.

### 3.4 Levels, bottle names and removing
**Prompt:**
> On each bottle row, add the Full / Half / Low / Empty level chip from the brand kit (tap to change), a way to add or edit the bottle name, and a way to remove the bottle with undo. Removing moves the bottle to past bottles with a finishedAt date instead of deleting it (no screen for past bottles yet). A closed spirit family shows a "1 low" badge when any of its bottles is Low.

**Done when:** levels and bottle names survive a refresh, removing can be undone, and a removed bottle shows up in past bottles in localStorage.

### 3.5 Search and filters in the cart
**Prompt:**
> At the top of the Bar Cart, add the search box ("Search by bottle or type", accent-insensitive, matching bottle names and types) and the row of filter buttons from PRD section 6 (All, Running low, Spirits, Liqueurs, Bitters, Mixers).

**Done when:** typing part of a bottle name or type narrows the list, and "Running low" shows only Low bottles.

### ⭐ Milestone A: enter your real bar cart
Remove the sample-cart button and enter your actual cart. Time it. Under 5 minutes? Note anything annoying for later.

---

## Phase 4: Make Now and recipe detail (3 sessions)

### 4.1 Make Now list
**Prompt:**
> Build the Make Now screen using the matching logic: a count header ("You can make 14 cocktails tonight."), and cocktail cards showing name, main ingredients, glass icon and source tag, styled per the brand kit.

**Done when:** the list matches what you'd expect from your real cart.

### 4.2 Recipe detail
**Prompt:**
> Build the recipe detail page from PRD section 6: name, glass, method, ingredients with amounts marked have / swap / missing (icon and word, not color alone), steps, and the source tag. Link it from Make Now cards.

**Done when:** every card opens its recipe, and the have/missing markers are correct.

### 4.3 Allow swaps toggle and source filter
**Prompt:**
> Add the "Allow swaps" toggle to Make Now (default from settings) and label swap matches on cards and the detail page ("Swap: dark rum for white rum"). Add the source filter (All / Starter set / each book).

**Done when:** toggling swaps changes the count, and swap cards are clearly labeled.

### ⭐ Milestone B: the core loop works
Stand at your bar cart, open the app, and make something it suggested. This is the moment the app becomes real.

---

## Phase 5: Unlock, Favorites and Home (3 sessions)

### 5.1 Unlock screen
**Prompt:**
> Build the Unlock screen from the PRD: a ranked list of "Add [ingredient]" cards with the mustard starburst badge showing "+N", expandable to show the cocktails each unlocks, and an "I bought it" button that adds the ingredient to my cart.

**Done when:** the top suggestion makes sense for your cart, and "I bought it" updates Make Now.

### 5.2 Favorites
**Prompt:**
> Add a favorite button to recipe detail and cards, and build the Favorites screen split into "Ready to make" and "Missing something."

**Done when:** favorites survive a refresh, and move between the two sections when your cart changes.

### 5.3 Home
**Prompt:**
> Build the Home screen from PRD section 6: greeting, makeable count (links to Make Now), bottles running low, "Tonight's pick" (a random makeable cocktail), a settings gear icon, and the responsible-drinking note. Use copy from the brand kit.

**Done when:** every number on Home is correct and tappable.

---

## Phase 6: Your data (3 sessions)

### 6.1 Settings, export and import
**Prompt:**
> Build the Settings screen: allow-swaps default, "Export my cart" (downloads a JSON file with version, date, cart, favorites, settings), and "Import a backup" with a confirmation before replacing data and a friendly error for invalid files. Add tests for export → import round-trips.

**Done when:** you export, clear your browser's site data, import, and everything comes back.

### 6.2 Private book recipes
**Prompt:**
> Add support for private recipe files in src/data/private/ (git-ignored). The app should load any recipes-book-*.json files found there and work normally if the folder is empty or missing. Add src/data/private/ to .gitignore and show me how to confirm git is ignoring it.

**Then, in a separate prompt:** type or paste 10 favorite recipes from your book and ask:
> Convert these recipes into our recipe format, with source {type: "book", title: "[title]", author: "[author]", page: N}. Use existing ingredient ids; if an ingredient is missing, add it to ingredients.json with a sensible parent and category, and tell me what you added.

**Done when:** book recipes show in Make Now with their source tag, the source filter shows your book, and **`git status` does not list the private folder.** Check this before every commit in this step.

### 6.3 Grow the starter set
**Prompt:**
> Expand recipes-starter.json to about 60 classic cocktails, written in our own words. List the sources you'd suggest checking for accuracy and any licensing notes.

**Done when:** the data-check test still passes, and Unlock suggestions feel richer.

---

## Phase 7: Polish and check (3 sessions)

### 7.1 Copy and empty states
**Prompt:**
> Review every screen against docs/brand-kit.md: tone of voice, empty states, button labels, colors and contrast rules. List the mismatches first, then fix them.

### 7.2 The v1 test
Check the PRD's "How we'll know v1 works" list (section 12) yourself:
- [x] 40-item cart setup in under 5 minutes
- [x] 10 hand-checked cases correct in Make Now and Unlock
- [x] Export, browser wipe, import: everything restored
- [x] Book recipes never appear on GitHub

Write down anything that fails or annoys you.

### 7.3 Fix list and release v1.0
Fix the most important issues from 7.2. Then ask Claude Code to update the README and tag the release `v1.0`. 🎉

---

## Phase 8: v1.1 First-run onboarding (3 sessions)

The rules are in PRD section 13 and the mockups are the `onboarding-*.html` files in [[screens/README|Screens]].

### 8.1 The setting, the migration and tour screens 1 to 4
**Prompt:**
> Read PRD section 13 and the onboarding mockups. Add an `onboardingDone` setting (false by default) and bump the store version with a migrate function that sets it to true when there are already bottles or favorites. Make old backups without the field import as true. Add an onboarding route outside the bottom-navigation layout, send first-time visitors there, and build tour screens 1 to 4 with Skip, Back (screens 2 to 4), progress dots and Next. Skip and "I'll do it later" set `onboardingDone` and go to Home. "Stock my cart" can go to a placeholder for screen 5. Add tests for the migration and the backup rule.

**Done when:**
- [x] A fresh browser (clear site data) opens on screen 1 with no bottom navigation
- [x] Skip on any screen and "I'll do it later" land on Home, and a refresh stays on Home
- [x] Back works on screens 2 to 4; the progress dots match the screen
- [x] An existing cart with bottles or favorites never sees the tour after the update
- [x] An old backup still imports
- [x] `npm test` and `npm run build` pass

### 8.2 Screen 5: pick your bottles
**Prompt:**
> Build onboarding screen 5 from its mockup: tap-to-pick pills grouped by category, about 10 common ingredients per category with "More …" for the rest, and a search box using `searchIngredients`. Show an "N picked" bar and "Add N bottles and start", which adds the picks as Full bottles with no names (reuse `addBottles`), sets `onboardingDone` and goes to Home. Ingredients already on the cart show as already added.

**Done when:**
- [x] Picking 6 pills and tapping "Add 6 bottles and start" puts 6 Full bottles on the Bar Cart
- [x] "cachaca" in the search finds Cachaça
- [x] "More …" shows the rest of a category
- [x] Picked pills are clear without color (check icon)
- [x] Setup of a typical cart takes under a minute

### 8.3 Replay the tour and the mockup check
**Prompt:**
> Add a "Replay the tour" button to Settings. Then compare every onboarding screen with its mockup (layout, copy, colors, states) and list the differences before fixing them.

**Done when:**
- [x] "Replay the tour" opens screen 1, and finishing or skipping returns to Home
- [x] On replay, bottles already on the cart show as added on screen 5
- [x] Every onboarding screen matches its mockup, or the difference is written in `decisions.md`

### 8.4 Age gate
**Prompt:**
> Add an age question right after the welcome screen: "Are you 21 or older?" with Yes and No. Save `ageConfirmed`, bump the store version so everyone is asked once, and make sure Skip, direct links and the main screens can't get around it. No shows a friendly message and keeps you out. Add tests for the migration, the backup rule and the redirect rule.

**Done when:**
- [x] A fresh browser goes Welcome, then the age question, then tour screen 2
- [x] Skip on the welcome screen still asks the age question before Home
- [x] Opening `/make` or `/welcome/3` without answering lands on the age question
- [x] "No" shows the message and no way into the app
- [x] Replaying the tour doesn't ask again
- [x] `npm test` and `npm run build` pass

---

## Phase 9: v1.2 Past bottles and mocktails (3 sessions)

The rules are in PRD section 14. There are no mockups: the Past bottles screen reuses the Bar Cart row style, and the filter reuses the Make Now filter buttons.

### 9.1 Past bottles screen
**Prompt:**
> Read PRD section 14. Add a Past bottles screen at `/cart/past`, opened from a link at the bottom of the Bar Cart that shows only when `pastBottles` isn't empty. List past bottles newest-finished first in the Bar Cart row style (name first, type second, added and finished dates), with an empty state and a back arrow. Add an "Add again" button that adds a new Full bottle with the same ingredient and name, and keeps the past bottle in the list. Put the sorting in `src/logic/` and add tests for it and the store action.

**Done when:**
- [x] Removing a bottle makes it show up on Past bottles with today's finished date
- [x] "Add again" puts a Full bottle with the same name back on the Bar Cart, and the past bottle stays listed
- [x] The link is hidden when there are no past bottles
- [x] An export and import keeps past bottles
- [x] `npm test` and `npm run build` pass

### 9.2 Mocktails and the Non-alcoholic filter
**Prompt:**
> Write about 10 starter mocktails in our own words, tagged `non-alcoholic`, using existing ingredient ids where possible (tell me about any new ingredients). Add a data test that every `non-alcoholic` recipe uses only ingredients with `alcoholic: false`. Add a Non-alcoholic filter button on Make Now next to the source filters that combines with them and with Allow swaps. Put the filter logic in `src/logic/recipeDisplay.ts` with tests.

**Done when:**
- [x] With only juices, syrups and mixers on the cart, the Non-alcoholic filter shows mocktails I can make
- [x] The filter works together with the source filter and Allow swaps
- [x] The data test fails if a tagged recipe uses an alcoholic ingredient
- [x] `npm test`, `npm run build` and `npm run lint` pass

### 9.3 Check and release v1.2
**Prompt:**
> Check the new screen and the filter against the brand kit (copy, colors, states, phone width). List the differences before fixing them. Then update the README, set the version to 1.2.0 and tag `v1.2`.

**Done when:**
- [x] Past bottles and the filter follow the brand kit, or the difference is written in `decisions.md`
- [x] README mentions past bottles and mocktails
- [x] Version 1.2.0, tagged `v1.2`

---

## Phase 10: v1.3 Smarter Unlock counting (2 sessions)

The rule is in PRD section 7, "Unlock calculation." No screen changes and no mockups.

### 10.1 Test every bottle
**Prompt:**
> Read PRD section 7, "Unlock calculation." Rewrite `unlockSuggestions` in `src/logic/matching.ts` to try every ingredient you don't own and count the recipes it would make makeable, using `matchRecipe`. Rank by count, break ties as PRD section 7 says (fewer swaps, then by family, general first inside a family), hide a suggestion when one ranked above it already unlocks all its recipes, and keep the top 10. Keep the same inputs and output so the Unlock screen doesn't change. Remove the old `shortcut:` comment. Add tests for each rule.

**Done when:**
- [x] London dry gin gets credit for recipes that ask for "gin"
- [x] Plymouth gin is hidden when London dry gin covers all its recipes
- [x] Simple syrup hides behind demerara syrup
- [x] An Empty bottle can still be suggested, and Allow swaps still changes the results
- [x] At most 10 suggestions
- [x] `npm test`, `npm run build` and `npm run lint` pass

### 10.2 Check and release v1.3
**Prompt:**
> Compare the Unlock list before and after on the sample cart and on my real cart, and list anything that looks like bad buying advice before fixing it. Then update the README, set the version to 1.3.0 and tag `v1.3`.

**Done when:**
- [x] The top suggestions make sense for the sample cart and my cart, or the difference is written in `decisions.md`
- [x] README describes the new counting
- [x] Version 1.3.0, tagged `v1.3`

---

## Phase 11: v1.4 Motion (6 sessions)

The rules are in [[motion|Motion guide]]. No new libraries: plain CSS transitions and the browser's built-in animation tools. Every animation follows the device's reduce-motion setting (the table in the motion guide says what to show instead).

### M.1 Motion tokens and the reduce-motion helper
**Prompt:**
> Read `docs/motion.md`. Add the timing tokens (`--motion-press`, `--motion-release`, `--motion-move`, `--ease-out`, `--ease-spring`) in one shared place, and a tiny "is reduce motion on?" helper. Don't animate anything yet.

**Done when:**
- [ ] The five tokens exist in one place and match the motion guide
- [ ] The helper reports the device's reduce-motion setting, with a test
- [ ] No visible change in the app
- [ ] `npm test`, `npm run build` and `npm run lint` pass

### M.2 Squish on buttons
**Prompt:**
> Add the Squish press from `docs/motion.md` to every pill button (primary and secondary) and the round Home button, using the M.1 tokens. Leave tab bar items, filter chips, text links and list rows alone. With reduce motion on, the button only darkens while pressed.

**Done when:**
- [ ] Pill buttons and the Home button shrink to 94% on press and spring back on release
- [ ] Tabs, filter chips, links and rows don't squish
- [ ] With reduce motion on, buttons only darken
- [ ] `npm test`, `npm run build` and `npm run lint` pass

### M.3 Bottle drawing with Settle
**Prompt:**
> Build a bottle drawing component with four levels (Full, Half, Low, Empty) and put it on each Bar Cart row next to the level control. When the level changes, the liquid slides to the new level with Settle from `docs/motion.md`. The level word stays visible. Not on Past bottles.

**Done when:**
- [ ] Each Bar Cart row shows the drawing with the level word next to it
- [ ] Changing a level slides the liquid over 450 ms, with no overshoot
- [ ] With reduce motion on, the liquid jumps straight to the new level
- [ ] Past bottles has no drawing
- [ ] `npm test`, `npm run build` and `npm run lint` pass

### M.4 I made this and Fill rise
**Prompt:**
> Read the "I made this" entry in the PRD Later list and the Pour section of `docs/motion.md`. Plan the small data change first (what gets saved, the new store version and migration, the backup version) and wait for my OK. Then add the **I made this** button to the recipe page; tapping it logs the drink and plays Fill rise. It never changes bottle levels.

**Done when:**
- [ ] The data change is written in the PRD (section 8) and `decisions.md`
- [ ] Store and backup versions go up; old saves and old backup files still load, with tests
- [ ] Tapping **I made this** logs the drink, plays Fill rise, and the glass stays full with the check until you leave the page
- [ ] Bottle levels don't change
- [ ] With reduce motion on, the glass is simply full with the check showing
- [ ] `npm test`, `npm run build` and `npm run lint` pass

### M.5 Count and burst on Unlock
**Prompt:**
> Add Count and burst from `docs/motion.md` to the top suggestion's starburst badge on the Unlock screen, once each time the screen opens, and after adding a bottle makes new recipes possible. Other badges stay still. Confirm with me where it plays before building (the guide marks this as needing my OK).

**Done when:**
- [ ] Where it plays is agreed and written in `decisions.md`
- [ ] The top badge pops in, counts up from +0 and bursts 10 shapes in Atomic Garden colors, once per visit
- [ ] It also plays after adding a bottle that unlocks new recipes
- [ ] With reduce motion on, the badge fades in with the final number and no shapes
- [ ] `npm test`, `npm run build` and `npm run lint` pass

### M.6 Check and release v1.4
**Prompt:**
> Check every animation with reduce motion on and off, in the browser and on a real phone. List anything janky or too much before fixing it. Then update the README, set the version to 1.4.0 and tag `v1.4`.

**Done when:**
- [ ] Every motion in the guide's "Where it goes" table works, and nothing else animates
- [ ] Reduce motion on shows the calm version everywhere
- [ ] Smooth on a real phone, or the difference is written in `decisions.md`
- [ ] README mentions motion and **I made this**
- [ ] Version 1.4.0, tagged `v1.4`

---

## What's next

After v1.4, pick from the PRD's "Later" list (section 5).

## Progress tracker

| Phase                     | Steps                | Status |
| ------------------------- | -------------------- | ------ |
| 0 Setup                   | 0.1, 0.2             | ☑      |
| 1 Foundations             | 1.1, 1.2, 1.3        | ☑      |
| 2 Matching engine         | 2.1, 2.2, 2.3        | ☑      |
| 3 Bar Cart                | 3.0-3.5, Milestone A | ☑      |
| 4 Make Now                | 4.1-4.3, Milestone B | ☑      |
| 5 Unlock, Favorites, Home | 5.1-5.3              | ☑      |
| 6 Your data               | 6.1-6.3              | ☑      |
| 7 Polish                  | 7.1-7.3              | ☑      |
| 8 Onboarding (v1.1)       | 8.1-8.3              | ☑      |
| 8.4 Age gate | 8.4 | ☑ |
| 9 Past bottles & mocktails (v1.2) | 9.1-9.3 | ☑ |
| 10 Smarter Unlock (v1.3) | 10.1-10.2 | ☑ |
| 11 Motion (v1.4) | M.1-M.6 | ☐ |
