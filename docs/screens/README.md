---
aliases: [Screens]
tags: [casa, screens]
---
# Screen mockups

[[Home]] · [[prd|PRD]] · [[brand-kit|Brand Kit]]

Design mockups of every v1 screen, exported from the "Casa Del Cocktail Screens" design canvas (October 2026). Open any `.html` file in a browser to see it (in Obsidian, clicking a link below opens it in your browser); the bottom navigation links between them.

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

**Shared across all screens:** bottom navigation with Bar Cart and Make Now on the left, a round Amber Home button in the center (level with the other tabs), Unlock and Favorites on the right. The active tab is Deep Amber and bold.

**Sample data:** names, counts and bottles are placeholders that tell one consistent story (Campari is missing, so Unlock suggests it). "[Your Book], p. 42" stands in for the real book. The real app computes all of this from the data.
