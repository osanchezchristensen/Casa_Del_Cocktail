# CLAUDE.md: Casa Del Cocktail

## What this project is
A virtual bar cart web app. The user adds what's on their bar cart, and the app shows which cocktails they can make now and which one extra ingredient would unlock the most new cocktails. Personal hobby and learning project, maybe a portfolio piece later.

**Full context lives in `/docs`. Read the relevant doc before starting a step:**
- `docs/project-brief.md`: goals, audience, scope
- `docs/prd.md`: user stories, screens, **matching rules (section 7)**, data shapes (section 8)
- `docs/brand-kit.md`: colors, fonts, UI feel, tone of voice and sample copy
- `docs/roadmap.md`: the step-by-step build plan; work one step at a time

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
- Steps **0.1** and **0.2** done (tools installed, repo on GitHub, Vite + React + TypeScript app scaffolded with React Router, Zustand, Lucide and Vitest installed). Step **1.1** done (brand styles in `src/styles/global.css`, bottom navigation, five placeholder screens). Step **1.2** done (types in `src/types.ts`, 187 ingredients in `src/data/ingredients.json` with a data-check test, `noSwap` rule added). Step **1.3** done (20 starter recipes in `src/data/recipes-starter.json` with a data-check test). Docs updated Oct 13 for bottles, past bottles, Bar Cart layout and a level Home button; the current bottom nav still has the raised button and needs the small fix in roadmap step 3.0. Step **2.1** done (`src/logic/matching.ts`: `ownedIngredientIds`, `missingIngredients`, `canMake` for rules 1, 2, 5, 6, with tests). Step **2.2** done (`matchRecipe` returns perfect / swap / missing with the swaps used; rules 3, 4, 7, 8; tequila is now the top of its own family, separate from mezcal). Step **2.3** done (`unlockSuggestions` ranks the top 10; the PRD now has a "Maybe" list, starting with smarter Unlock counting). Next: roadmap step **3.0** (level Home button), then **3.1** (cart store and list). Steps 3.1-3.4 in the roadmap still describe "items" and "brand notes" and need updating for bottles first.
- Update this line as steps are completed.
