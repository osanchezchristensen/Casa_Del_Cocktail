# Casa Del Cocktail: MVP Roadmap

**Version:** 0.1 | **Date:** October 12, 2026
**Related docs:** `project-brief.md`, `brand-kit.md`, `prd.md`

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
> At the top of the Bar Cart, add the search box ("Search by bottle or type", accent-insensitive, matching bottle names and types) and the row of filter buttons from PRD section 6 (All, Spirits, Liqueurs, Running low, Bitters, Mixers).

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
- [ ] 40-item cart setup in under 5 minutes
- [ ] 10 hand-checked cases correct in Make Now and Unlock
- [ ] Export, browser wipe, import: everything restored
- [ ] Book recipes never appear on GitHub

Write down anything that fails or annoys you.

### 7.3 Fix list and release v1.0
Fix the most important issues from 7.2. Then ask Claude Code to update the README and tag the release `v1.0`. 🎉

---

## After v1

Pick from the PRD's "Later" list. The suggested next three:
1. In-app "Add my own recipe" form
2. Refill list / shopping list
3. PWA, free hosting and phone install (this unlocks using it at the liquor store)

## Progress tracker

| Phase | Steps | Status |
|---|---|---|
| 0 Setup | 0.1, 0.2 | ☐ |
| 1 Foundations | 1.1, 1.2, 1.3 | ☐ |
| 2 Matching engine | 2.1, 2.2, 2.3 | ☐ |
| 3 Bar Cart | 3.0-3.5, Milestone A | ☐ |
| 4 Make Now | 4.1-4.3, Milestone B | ☐ |
| 5 Unlock, Favorites, Home | 5.1-5.3 | ☐ |
| 6 Your data | 6.1-6.3 | ☐ |
| 7 Polish | 7.1-7.3 | ☐ |
