# Casa Del Cocktail: Product Requirements Document (PRD)

**Version:** 0.1 (draft) | **Date:** October 12, 2026
**Related docs:** `project-brief.md`, `brand-kit.md`

---

## 1. Overview

Casa Del Cocktail is a virtual bar cart that runs in the browser. You add what's on your shelf, and the app shows:
1. which cocktails you can make **right now**, and
2. which **one more ingredient** would unlock the most new cocktails.

Recipes come from a curated starter set and from your own cocktail book, each tagged with its source.

**Version 1 is a working prototype** that runs on your own computer (localhost), stores data in the browser, and has no accounts.

## 2. Goals and non-goals

**Goals for v1**
- Set up a bar cart quickly (about 40 items in a few minutes)
- Accurately show what you can make, using sensible substitution rules
- Show which single purchase unlocks the most new cocktails
- Save favorites
- Track bottle levels and flag refills
- Never lose data (export/import backup)

**Non-goals for v1**
- Barcode scanning or photo recognition
- Accounts, login, syncing between devices
- Phone install (PWA), offline mode, public hosting
- An in-app recipe editor (book recipes come in through a file)
- Age gate (private project; add before any public launch)

## 3. Users

| User | Description | Main need |
|---|---|---|
| **The owner** (you, primary) | Has a bar cart and a cocktail book; wants to use both more | "What can I make tonight?" and "What should I buy next?" |
| **A friend** (secondary) | Opens the app on your computer, or later their own device | Quick, non-intimidating suggestions |
| **A beginner** (future) | Starting a first bar cart | Guidance on what to buy first |

## 4. User stories

Format: *As a [user], I want [action] so that [benefit].* **Must** = needed for v1. **Should** = in v1 if time allows. **Later** = after v1.

### Bar cart
| # | Story | Priority |
|---|---|---|
| C1 | As the owner, I want to search for an ingredient by typing a few letters so I can add it quickly. | Must |
| C2 | As the owner, I want to tick off many items at once from category checklists (spirits, liqueurs, bitters…) so that first-time setup is fast. | Must |
| C3 | As the owner, I want to confirm the item I picked before it's added, so I don't add the wrong thing. | Must |
| C4 | As the owner, I want to optionally note the brand (for example, "Bulleit") so I remember which bottle I have. | Should |
| C5 | As the owner, I want to set each item's level (Full / Half / Low / Empty) so I know what's running out. | Must |
| C6 | As the owner, I want to remove an item from my cart. | Must |
| C7 | As the owner, I want to see my cart grouped by category. | Must |
| C8 | As the owner, I want a list of items marked Low so I know what to restock. | Should |

### Make Now
| # | Story | Priority |
|---|---|---|
| M1 | As the owner, I want to see every cocktail I can make with my cart right now. | Must |
| M2 | As the owner, I want garnishes, optional ingredients and basics (ice, water, sugar) to be ignored so that results aren't too strict. | Must |
| M3 | As the owner, I want to turn on **"Allow swaps"** so that recipes needing a specific type (white rum) also show when I have a related one (dark rum), clearly labeled as a swap. | Must |
| M4 | As the owner, I want to filter results by source (starter set or my book). | Must |
| M5 | As the owner, I want to search and filter by base spirit. | Should |
| M6 | As the owner, I want to filter to non-alcoholic recipes. | Later |

### Unlock
| # | Story | Priority |
|---|---|---|
| U1 | As the owner, I want to see a ranked list of single ingredients I don't own, with how many new cocktails each would unlock. | Must |
| U2 | As the owner, I want to tap a suggestion and see exactly which cocktails it unlocks. | Must |
| U3 | As the owner, I want to add a suggested ingredient straight to my cart after I buy it. | Should |

### Recipes and favorites
| # | Story | Priority |
|---|---|---|
| R1 | As the owner, I want a recipe detail page with ingredients, amounts, method, glass and source (book, page). | Must |
| R2 | As the owner, I want each ingredient on the recipe page marked as "have it," "swap," or "missing." | Must |
| R3 | As the owner, I want to save and unsave favorites. | Must |
| R4 | As the owner, I want my favorites list to show which ones I can make right now. | Must |

### Home, data and settings
| # | Story | Priority |
|---|---|---|
| H1 | As the owner, I want a simple home screen with a summary (cocktails I can make, items running low, a "tonight's pick" suggestion). | Must |
| D1 | As the owner, I want to export my cart and favorites to a file and import it back, so I never lose my data. | Must |
| D2 | As the owner, I want my book's recipes to load automatically if the private recipe file exists, and the app to work fine if it doesn't. | Must |
| D3 | As a visitor, I want to see a short responsible-drinking note. | Must |

## 5. Feature list: MVP vs later

### MVP (v1)
1. **Bottom navigation** with a raised round Home button in the center
2. **Home** (simple summary, placeholder for future features)
3. **Bar Cart:** search, category checklists, confirm-before-add, levels, remove, optional brand note
4. **Make Now:** smart matching, "Allow swaps" toggle, source filter
5. **Unlock:** ranked "one more ingredient" suggestions
6. **Favorites**
7. **Recipe detail** with have/swap/missing markers and source tag
8. **Recipe data:** ~50-100 starter recipes and private book recipes, all tagged by source
9. **Export / Import** backup
10. **Responsible-drinking note**
11. **Settings** (small: Allow swaps default, export/import, about)

### Later (rough order)
1. In-app "Add my own recipe" form
2. Refill reminders and a shopping list
3. Home features: photos of your drinks, highlighted favorites
4. Non-alcoholic filter and a mocktail recipe set
5. PWA: install on phone, offline mode, free hosting
6. Barcode scanning, with a confirm-each-scan step
7. Photo recognition of bottles; photo import of book pages
8. Recipe import from a public API
9. Accounts and sync
10. Age gate (required before any public launch)

## 6. Key screens

The layout is **mobile-first**: on your computer it shows as a phone-width column centered in the browser window. That keeps your sketched bottom navigation and makes the later move to a phone easy.

### Navigation (from your sketch)

```
+------------------------------------------+
|                                          |
|               (screen)                   |
|                                          |
|                  ____                    |
+-----------------/    \-------------------+
|  [Cart] [Make] ( HOME ) [Unlock] [Faves] |
+------------------------------------------+
```
- Four tabs: **Bar Cart**, **Make Now**, **Unlock**, **Favorites**, two on each side
- Center: a larger **round Home button**, raised slightly above the bar (Amber fill)
- Settings: a small gear icon in the Home screen header

### Screen list

| Screen | What's on it |
|---|---|
| **Home** | Greeting ("Welcome back to Casa"), "You can make **14** cocktails" (taps through to Make Now), "**2** bottles running low," "Tonight's pick" (one random makeable cocktail), responsible-drinking note. Placeholder for future features. |
| **Bar Cart** | Search bar at top; cart grouped by category; each item shows name, optional brand, level chip (tap to change). "Add items" opens the add flow. |
| **Add items (sheet)** | Two modes: **Search** (type-ahead results) and **Browse** (category checklists with multi-select). Ends with a **confirm** step: "Add these 6 items?" |
| **Make Now** | Count header, "Allow swaps" toggle, source filter (All / Starter set / *[Book]*), list of cocktail cards. Swap cards are labeled ("Swap: dark rum for white rum"). |
| **Unlock** | Ranked list: "**Add Campari**, +6 cocktails" with starburst badge. Tap to expand the list of cocktails it unlocks. |
| **Favorites** | Saved cocktails, split into "Ready to make" and "Missing something." |
| **Recipe detail** | Name, glass icon, method, ingredient list with ✓ have / ⇄ swap / ✗ missing, steps, source tag ("From *[Book]*, p. 42"), favorite button. |
| **Settings** | Allow swaps default, Export my cart, Import a backup, About and responsible-drinking note. |

**Empty states** use the sample copy from the brand kit (for example, empty cart: "Your cart's looking a little bare…").

## 7. Matching rules (the core logic)

This is the heart of the app and the part most worth getting right, and testing.

### Ingredient family tree
Every ingredient can have a **parent**, forming a family tree:

```
spirit
 └─ rum
     ├─ white rum
     ├─ dark rum
     └─ aged rum
 └─ whiskey
     ├─ bourbon
     └─ rye whiskey
```

### Rules
1. **General recipe, specific bottle: match.** Recipe says "rum," you have "dark rum": ✓ can make.
2. **Specific recipe, specific bottle: exact match needed.** Recipe says "white rum," you have "dark rum": ✗ not by default (specific beats general).
3. **Swaps (the override).** With **Allow swaps** on, rule 2 relaxes: a specific ingredient can be filled by a sibling in the same family (dark rum for white rum). The cocktail shows as **"with a swap,"** never as a perfect match.
4. **Recipe-level flexibility.** A recipe's author can mark an ingredient as "any of this family is fine" (for example, "any orange liqueur"), which works like a swap without needing the toggle.
5. **Ignored ingredients:** garnishes, ingredients marked optional, and "always on hand" basics (ice, water, plain sugar, salt).
6. **Bottle levels:** Full, Half and Low count as owned. **Empty does not.**
7. **Swaps never cross families.** Rum never stands in for gin.
8. **No-swap ingredients.** Some family members are too different to stand in for each other (sweet and dry vermouth, fino and oloroso sherry, spiced rum, blue curaçao). An ingredient marked `noSwap` can't fill in for a sibling, and a sibling can't fill in for it, even with **Allow swaps** on. Rules 1 and 4 still apply: a recipe that says "vermouth," or marks vermouth as "any of this family," accepts any vermouth you own.

### Unlock calculation
For every ingredient you **don't** own (or that's Empty): count the recipes where it's the **only** missing required ingredient. Rank by that count, highest first, and show the top 10. With swaps on, swap matches count as makeable.

## 8. Data needed

All data is stored as JSON. These are plain-English descriptions; Claude Code will turn them into TypeScript types.

### Ingredient (built into the app)
| Field | Example | Notes |
|---|---|---|
| id | `white-rum` | Unique, lowercase |
| name | White rum | Display name |
| category | spirit | spirit, liqueur, fortified wine/vermouth, wine and beer, bitters, syrup, juice, mixer, garnish, other |
| parentId | `rum` | Family tree; empty at the top |
| aliases | "light rum", "silver rum" | Helps search |
| alcoholic | true | For the mocktail filter later |
| alwaysOnHand | false | true for ice, water, sugar, salt |
| noSwap | true | Optional. Rule 8: never swaps in or out. Left off most ingredients |

### Recipe
| Field | Example | Notes |
|---|---|---|
| id | `daiquiri` | Unique |
| name | Daiquiri | |
| ingredients | list (see below) | |
| steps | "Shake with ice. Strain into a chilled coupe." | List of short steps |
| glass | coupe | coupe, rocks, highball, martini, collins, flute, mug, other (picks the glass icon) |
| method | shaken | shaken, stirred, built, blended |
| tags | classic, sour | Free tags; includes `non-alcoholic` |
| source | `{ type: "book", title: "…", author: "…", page: 42 }` or `{ type: "starter" }` | Required on every recipe |

Each **recipe ingredient**:
| Field | Example | Notes |
|---|---|---|
| ingredientId | `white-rum` | Must match an ingredient id |
| amount / unit | 2 / oz | Unit: oz, ml, dash, barspoon, tsp, piece, top |
| optional | false | Ignored when matching |
| garnish | false | Ignored when matching |
| anyOfFamily | false | Rule 4: any member of this family is fine |

### Your data (stored in the browser)
| Item | Fields |
|---|---|
| Cart item | ingredientId, level (full/half/low/empty), brand (optional), addedAt |
| Favorite | recipeId, savedAt |
| Settings | allowSwaps (on/off) |

### Export file
One JSON file containing a version number, export date, cart items, favorites and settings. Import replaces current data after a confirmation ("This will replace your current cart. Continue?").

### Recipe files
| File | Contents | In git? |
|---|---|---|
| `src/data/ingredients.json` | The ingredient list and family tree | Yes |
| `src/data/recipes-starter.json` | The starter set | Yes |
| `src/data/private/recipes-book-*.json` | Your book's recipes | **No** (git-ignored) |

The app loads the private file if it exists and works normally if it doesn't. Book recipes are made by typing or pasting a recipe into Claude and asking it to convert to this format using existing ingredient ids, adding new ingredients to `ingredients.json` when needed.

## 9. Technical considerations

| Area | Choice | Why |
|---|---|---|
| Build tool | **Vite** | Fast, simple, standard |
| Framework | **React + TypeScript** | Claude Code knows it well; TypeScript catches mistakes in the data |
| Routing | **React Router** | One route per screen |
| App state + saving | **Zustand** with its "persist" add-on (saves to browser localStorage) | Very little code; saving happens automatically |
| Styling | **Plain CSS with CSS variables** (brand colors and fonts as variables) and CSS Modules per component | Easy to read for someone who knows HTML/CSS; maps directly to the brand kit |
| Icons | **Lucide** | Matches the "simple line icons" brand guidance |
| Tests | **Vitest** for the matching and unlock logic | The core logic must be right; tests make Claude Code's changes safe |
| Server | None | Everything runs in the browser |
| Hosting | None for v1 (localhost) | Free hosting comes with the PWA step |

**Principles for Claude Code**
- Keep the matching logic in its own plain TypeScript file, separate from screens, with tests.
- Build in small steps, each one runnable and checked in the browser before moving on.
- Data shapes are versioned so later changes (accounts, scanning) don't break saved carts.
- Mobile-first layout, centered on desktop.

## 10. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Matching gives wrong answers | High: it's the core feature | Clear rules (section 7), a clean ingredient tree, automated tests with real examples |
| Ingredient list gets messy as book recipes are added | Medium | Claude reuses existing ids; new ingredients need a parent and category |
| Browser data cleared | Medium | Export/Import; remind to back up after big changes |
| Scope creep (scanning, home features) | High for a side project | This PRD's MVP list is the line; new ideas go to "Later" |
| Book copyright | Low while private | Private, git-ignored file; private repo |
| Learning curve with React and Claude Code | Medium | Small steps; ask Claude Code to explain each change |
| Starter recipe licensing | Low | Check source licenses; write steps in our own words |

## 11. Open questions

1. Which public sources seed the starter set, and what are their licenses?
2. Should Home's "Tonight's pick" favor favorites or be fully random?
3. How should amounts display: oz only, or an oz/ml toggle?
4. Do we need the "Low items" list in v1, or can the Home summary cover it?
5. ~~What exactly counts as "always on hand"? Is simple syrup a basic or a cart item?~~ **Answered (Oct 13, 2026):** only ice, water, sugar and salt are always on hand. Simple syrup is a cart item.

## 12. How we'll know v1 works

- Setting up a 40-item cart takes under 5 minutes.
- For 10 hand-checked test cases, Make Now and Unlock give the right answer.
- You reach for the app at your bar cart at least a few times in the first month.
- Your cart survives an export, a browser data wipe, and an import.
