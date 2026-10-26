# CLAUDE.md: Casa Del Cocktail

## What this project is
A virtual bar cart web app. The user adds what's on their bar cart, and the app shows which cocktails they can make now and which one extra ingredient would unlock the most new cocktails. Personal hobby and learning project, maybe a portfolio piece later.

**Full context lives in `/docs`. Read the relevant doc before starting a step:**
- `docs/project-brief.md`: goals, audience, scope
- `docs/prd.md`: user stories, screens, **matching rules (section 7)**, data shapes (section 8)
- `docs/brand-kit.md`: colors, fonts, UI feel, tone of voice and sample copy
- `docs/roadmap.md`: the step-by-step build plan; work one step at a time
- `docs/Home.md`: start page of the docs (an Obsidian vault)
- `docs/decisions.md`: decision log
- `docs/ideas.md`: ideas inbox (not part of v1 until moved to the PRD)
- `docs/screens/`: HTML mockups of every v1 screen; its README says which file is which. **Before building or changing any screen, open its mockup** and match its layout, copy, colors and states. Use the brand CSS variables and CSS Modules, never the mockup's inline styles. If a mockup and the PRD disagree, **follow the PRD and tell me about the difference**.

### Docs conventions
- Keep the frontmatter and the link row at the top of every doc. Link between docs with `[[wikilinks]]`. Don't rename or move the main docs.
- When we make a product or technical decision, add a dated line with the reason to `docs/decisions.md`.
- When I ask to keep an idea from `docs/ideas.md`, move it into the PRD's Later or Maybe list and mark it as moved in `ideas.md`.
- Never read or edit anything in `.obsidian/` (my personal Obsidian settings, git-ignored).

## About the owner (how to work with me)
- I know HTML and Python and have built web apps by hand, but I'm **new to React, TypeScript and building with Claude Code**.
- **Plan before coding.** For each step, show a short plan in plain language and wait for my OK.
- **Small steps.** One roadmap step at a time. Don't build ahead or add features that aren't in the step.
- **Explain as you go.** After changes, summarize what changed and why in plain language, and point me to the main file to read.
- **Ask before** adding a new npm package, changing a data shape, deleting files, or deviating from the docs.
- If an idea comes up that isn't in v1, suggest adding it to the PRD's "Later" list instead of building it.
- After a step works, offer to commit with a clear message. Never push to GitHub unless I ask.

## Tech stack
- **Vite + React + TypeScript**, runs entirely in the browser, **no server, no accounts**
- **React Router** for screens
- **Zustand** with `persist` (localStorage) for the cart, favorites and settings; store has a version number
- **Plain CSS with CSS variables** for brand tokens, **CSS Modules** per component (no Tailwind, no UI kit)
- **Lucide** icons
- **Vitest** for tests
- Runs on localhost only for v1. No PWA, hosting or backend yet.

## Commands
- `npm run dev`: start the app at http://localhost:5173
- `npm test`: run tests
- `npm run build`: production build (also checks types)
- `npm run lint`: check the code for common mistakes (oxlint)

(Update this list if scripts change.)

## Project structure (target)
```
docs/                  planning documents (don't edit unless asked)
src/
  data/
    ingredients.json         ingredient list + family tree (parentId)
    recipes-starter.json     curated starter recipes (source: starter)
    private/                 GIT-IGNORED: book recipes (recipes-book-*.json)
  logic/
    matching.ts              can-make + unlock logic (pure TypeScript, no React)
    matching.test.ts
  store/                     Zustand store
  screens/                   Home, BarCart, MakeNow, Unlock, Favorites, RecipeDetail, Settings
  components/                shared UI (BottomNav, CocktailCard, LevelChip, ...)
  styles/                    global CSS + brand variables
```

## Core rules (don't break these)

### Matching (full detail: PRD section 7)
1. General recipe ingredient + specific bottle = match (recipe "rum", own "dark rum").
2. Specific recipe ingredient needs an exact match (recipe "white rum", own "dark rum" = no) unless...
3. ..."Allow swaps" is on: a sibling in the same family can fill it, and the result is labeled as a swap.
4. Recipe ingredients marked `anyOfFamily` accept any member of that family.
5. Ignore garnishes, optional ingredients and `alwaysOnHand` basics (ice, water, sugar, salt). A garnish is decided by the **recipe ingredient's `garnish` flag**, never by the ingredient's category (mint in a Mojito is required).
6. Full / Half / Low count as owned. **Empty does not.** An ingredient is owned if any of its bottles is not Empty.
7. Swaps never cross families (rum never replaces gin).
8. Ingredients marked `noSwap` (sweet/dry/blanc vermouth, the sherries, spiced rum, blue curaçao) never swap in or out, even with "Allow swaps" on. Rules 1 and 4 still apply to them.
- **Unlock:** rank unowned (or Empty) ingredients by how many recipes they're the *only* missing required ingredient for. Top 10.
- Matching logic stays in `src/logic/`, free of React, and **every rule change gets a test.**
- Matching takes a **set of owned ingredient ids**, never bottles. The app works that set out from the bottles first.

### Data
- Every recipe **must** have a `source` (`{ type: "starter" }` or `{ type: "book", title, author, page }`).
- Recipe ingredients must use ids that exist in `ingredients.json`. A test enforces this.
- New ingredients need a sensible `category` and `parentId`. Reuse existing ids before adding new ones.
- "Spirit" is a `category`, not a parent. Each family's top (`rum`, `gin`, `whiskey`) has `parentId: null`, so swaps can't cross families. Types live in `src/types.ts`.
- **The cart is a list of bottles**, not ingredients: each bottle has `id`, `ingredientId`, optional `name` (brand or label), `level`, `addedAt`. Several bottles can share an `ingredientId`. Removing a bottle moves it to `pastBottles` with a `finishedAt` date instead of deleting it (no screen for this in v1). See PRD section 8.
- Bar Cart: sections collapse, spirits are grouped by family (each family's top ingredient), bottles show their name first and type second.
- Ingredient search must be accent-insensitive ("cachaca" finds Cachaça, "anejo" finds Añejo tequila).
- Starter recipes are written in our own words.

### Book recipes are private (copyright)
- Book recipes live **only** in `src/data/private/`, which is git-ignored.
- **Never** copy book recipes into tracked files, tests, docs or commit messages.
- The app must work normally when `src/data/private/` is empty or missing.
- Before any commit, check `git status` does not include files from `src/data/private/`.
- When I paste book recipes, convert them to our recipe format using existing ingredient ids and tell me about any ingredients you added.

## Design (full detail: brand-kit.md)
- **Feel:** mid-century, warm, cozy, "Atomic Garden," light mode only. **No tiki, neon, wood grain or script fonts.**
- **Layout:** mobile-first; on desktop, a phone-width column centered on the page.
- **Navigation:** bottom bar. Bar Cart and Make Now on the left, a **round Home button** in the center (level with the other tabs, not raised), Unlock and Favorites on the right. Settings is a gear icon on Home.
```
Colors:  cream #F5ECD7 | paper #FBF6EA | walnut #3B2A1E | cork #6E5A47
         amber #D98E2B | deep-amber #A0570F | mustard #E3B23C
         avocado #5A6B22 | teal #2C6863 | rust #A8442A
Fonts:   headings "Righteous"; body "DM Sans" (400/500/700), Google Fonts
Shapes:  cards radius 20px, pill buttons, inputs radius 12px, soft warm shadows
```
- Never use Amber or Mustard as text on cream (too low contrast). Use them as fills with Walnut text.
- Never rely on color alone for status. Pair it with a word or icon.
- The mustard starburst badge is used only on Unlock suggestions.
- **Voice:** a friendly host. Plain words, short sentences, lead with what the user *can* do, at most one light joke per screen, plain button labels. Use sample copy from the brand kit where it fits.
- Show a responsible-drinking note (Home footer and Settings).

## Out of scope for v1
Barcode or photo scanning, accounts and sync, PWA/offline/hosting, in-app recipe editor, recipe API import, age gate, shopping list. These are on the PRD's "Later" list. Don't build them unless I ask.

## Current status
- Steps **0.1** and **0.2** done (tools installed, repo on GitHub, Vite + React + TypeScript app scaffolded with React Router, Zustand, Lucide and Vitest installed). Step **1.1** done (brand styles in `src/styles/global.css`, bottom navigation, five placeholder screens). Step **1.2** done (types in `src/types.ts`, 186 ingredients in `src/data/ingredients.json` with a data-check test, `noSwap` rule added). Step **1.3** done (20 starter recipes in `src/data/recipes-starter.json` with a data-check test). Docs updated Oct 13 for bottles, past bottles, Bar Cart layout and a level Home button. Step **2.1** done (`src/logic/matching.ts`: `ownedIngredientIds`, `canMake` for rules 1, 2, 5, 6, with tests). Step **2.2** done (`matchRecipe` returns perfect / swap / missing with the swaps used; rules 3, 4, 7, 8; tequila is now the top of its own family, separate from mezcal). Step **2.3** done (`unlockSuggestions` ranks the top 10; the PRD now has a "Maybe" list, starting with smarter Unlock counting). Roadmap Phase 3 updated Oct 20 for bottles (steps 3.1-3.4 rewritten, new 3.5 for cart search and filters). Step **3.0** done (Home button is 52px and level with the other tabs). Step **3.1** done (`Bottle` / `PastBottle` types, Zustand store in `src/store/useStore.ts` with a temporary sample cart, grouping logic in `src/logic/cart.ts`, Bar Cart list with collapsible sections and spirit families, read-only `LevelChip`; mezcal is now its own family and "agave-spirit" was removed). Step **3.2** done (`AddItemsSheet` on `<dialog>` with search and a confirm step with optional bottle names; accent-insensitive `searchIngredients` in `src/logic/search.ts`; `addBottles` store action). Step **3.3** done (Search / Browse switch in `AddItemsSheet`; Browse shows collapsible category checklists; picks are shared between modes). Step **3.4** done (tap the level chip to step it down; `BottleSheet` edits name and level and removes; remove moves to `pastBottles` with an undo bar; "N low" badge on closed families; store actions `updateBottle`, `removeBottle`, `undoRemove` with tests; sheets share `Sheet.module.css`). Step **3.5** done (cart search over bottle name, type and family; filter buttons with "Running low" next to "All" in rust colors; `filterBottles` in `src/logic/cart.ts` with tests). **Milestone A** done in part (sample-cart button removed; the cart starts with temporary sample bottles from `SAMPLE` in `src/store/useStore.ts`; before sharing the app or entering the real cart, set `bottles: []`, delete `SAMPLE` and clear the `casa-del-cocktail` localStorage key). Step **3.6** done (Bar Cart now matches `docs/screens/bar-cart.html`: header count, teal filters with a Running low count, uppercase section headers, "Low · refill" chip, first spirit family open; `levelSummary` and `countLow` in `src/logic/cart.ts`). Step **4.1** done (Make Now lists the cocktails you can make: count header and `CocktailCard` with glass icon, main ingredients, Ready/Swap status and source tag; `makeableRecipes` and `mainIngredients` in `src/logic/matching.ts`; `src/data/recipes.ts` joins starter and private book recipes). Step **4.2** done (recipe page at `/make/:id`, linked from every Make Now card: swap note, ingredient rows marked Have it / Swap / Missing with icon and word, steps under a "Recipe" heading; `ingredientStatuses` in `src/logic/matching.ts`, `formatAmount` in `src/logic/recipeDisplay.ts`). Next: step **4.3** (Allow swaps toggle and source filter).
- Update this line as steps are completed.
