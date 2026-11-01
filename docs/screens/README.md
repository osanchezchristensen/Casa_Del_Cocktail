---
aliases: [Screens]
tags: [casa, screens]
---
# Screen mockups

[[Home]] · [[prd|PRD]] · [[brand-kit|Brand Kit]]

Design mockups of every v1 screen and the v1.1 onboarding flow, exported from the "Casa Del Cocktail Screens" design canvas (October 2026). Open any `.html` file in a browser to see it (in Obsidian, clicking a link below opens it in your browser); the bottom navigation links between them.

**These are visual references, not app code.** Build the real screens in React following `CLAUDE.md`, the PRD and the brand kit, and use these files to match layout, spacing, copy and colors. Don't copy their inline styles into the app; use the brand CSS variables and CSS Modules instead.

| File | Screen | Things to notice |
|---|---|---|
| [home.html](home.html) | Home | Greeting, "You can make 14" card, low bottles and ready favorites, Tonight's pick, responsible-drinking note, settings button |
| [bar-cart.html](bar-cart.html) | Bar Cart | Filter buttons, collapsible sections, spirits grouped by family, bottle name first and type second, level chips, "1 low" badges on closed groups |
| [add-items.html](add-items.html) | Add items sheet | Search and Browse tabs, "You have 1" hints, confirm step with an optional bottle name per pick |
| [make-now.html](make-now.html) | Make Now | Count header, Allow swaps switch, source filter, cards marked Ready or Swap, source tags |
| [recipe-detail.html](recipe-detail.html) | Recipe detail | Swap note, ingredients marked have / swap / missing (icon and word), method, favorite button |
| [unlock.html](unlock.html) | Unlock | Ranked suggestions with the mustard starburst "+N" badge, expanded top card, "I bought it" button |
| [favorites.html](favorites.html) | Favorites | "Ready to make" and "Missing something" sections |

## v1.1: first-run onboarding

Shown once, the first time someone opens the app. The tour screens have no bottom navigation. Open `onboarding-1-welcome.html` and click through.

| File | Screen | Things to notice |
|---|---|---|
| [onboarding-1-welcome.html](onboarding-1-welcome.html) | 1. Welcome | Blob illustration with a coupe, "Welcome to Casa.", **Show me around** button, **Skip** top right |
| [onboarding-2-stock.html](onboarding-2-stock.html) | 2. Stock your cart | Preview of bottle rows with level chips, back arrow, progress dots |
| [onboarding-3-make-now.html](onboarding-3-make-now.html) | 3. See what you can make | Preview cards: one Ready, one Swap |
| [onboarding-4-unlock.html](onboarding-4-unlock.html) | 4. Find your next bottle | Unlock preview with the starburst (allowed here because it previews Unlock), **Stock my cart** and **I'll do it later** |
| [onboarding-5-pick-bottles.html](onboarding-5-pick-bottles.html) | 5. What's on your cart? | Tap-to-pick pills by category (picked = Avocado fill with a check), search for anything else, "N picked" bar, **Add N bottles and start**. No bottle names here; those can be added later |

**Onboarding rules:** every screen has **Skip** (goes to Home). Screens 2 to 5 have a back arrow. Progress dots show steps 1 to 4. Screen 5 is not counted in the dots. "Add N bottles and start" and "I'll do it later" both finish onboarding and go to Home.

**Shared across the main screens (not onboarding):** bottom navigation with Bar Cart and Make Now on the left, a round Amber Home button in the center (level with the other tabs), Unlock and Favorites on the right. The active tab is Deep Amber and bold.

**Sample data:** names, counts and bottles are placeholders that tell one consistent story (Campari is missing, so Unlock suggests it). "[Your Book], p. 42" stands in for the real book. The real app computes all of this from the data.
