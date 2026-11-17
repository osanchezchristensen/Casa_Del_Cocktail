---
aliases: [Ideas Inbox]
tags: [casa, ideas]
---
# Ideas inbox

[[Home]] · [[prd|PRD]] · [[decisions|Decisions]]

Quick notes on anything you might want later. No need to be tidy. When an idea is worth keeping, ask Claude Code to move it into the PRD's **Later** list (planned) or **Maybe** list (worth weighing), then cross it off here.

## New
- **Alexa / Echo Show voice skill** (Oct 25): "Alexa, ask Casa what I can make," and it reads back a few cocktails with simple cards on the screen. Could also answer "what should I buy next?"
  - **Needs first:** hosting, and the cart stored online (accounts and sync), since the Echo Show can't see data saved in my computer's browser.
  - **Reuses:** the matching logic in `src/logic/` (plain TypeScript, no React).
  - **Easier first step:** once the app is hosted, try opening it in the Echo Show's web browser (touch only, no voice). Check that my model has one.
  - **Skip:** rebuilding every screen for the Echo Show (it uses Amazon's own layout language, APL, not React). Too much work for the payoff.
  - **Before starting:** check Amazon's current developer docs, since Alexa is being reworked around Alexa+.
- **Recipe Book screen** (Oct 25): one place to browse *every* recipe in the app, whether or not I can make it. Starter set, my book, and my own custom recipes.
  - **Why:** Make Now only shows what I can make tonight, and Favorites only shows what I've saved. There's no way to just flip through everything.
  - **Could include:** search by name or ingredient; filters by source (starter / my book / custom), base spirit and "can make now"; each card marked Ready / Swap / Missing, using the matching logic that already exists; tapping opens the existing recipe detail page.
  - **Ties into:** the "Add my own recipe" form on the PRD Later list (custom recipes would live here, with an "Add recipe" button) and the PRD's M5 story (search and filter by base spirit).
  - **Open question:** where it goes in the navigation. The bottom bar already has five spots, so maybe a "See all recipes" link from Make Now and Home, or replacing one tab.
- **Seasonal drinks** (Nov 2): recipes that only show up during a set time of year (Christmas drinks in December, Halloween drinks in October, and so on).
  - **How it could work:** a recipe gets an optional "season" with a start and end date. Outside those dates it's hidden from Make Now and the Recipe Book. Inside them it shows as normal, maybe with a small seasonal tag.
  - **Open questions:** a "Show all seasons" switch so I can still find a hidden recipe? Should my own recipes be able to set a season too? Which seasons to start with?
  - **Ties into:** the Recipe Book and "Add my own recipe". The date check would go in the logic folder, next to the matching rules.
  - **Party Mode:** seasonal templates could sit next to Taco night and Classics in Pick drinks (a "Later hook" in [[party-mode|Party Mode]]).
- **Drink playlists** (Nov 17): save recipes into your own named lists, like playlists in a music app ("Summer patio", "Date night", "Easy weeknight"), so you can sort drinks your own way. Favorites would be the first, built-in list.
  - **How it could work:** a "Save to…" button on the recipe page and Make Now cards opens a small sheet with your lists and a "New list" row. One drink can be in many lists. A Lists view (maybe a filter in the Recipe Book) shows each list with a "ready to make" count, using the same Ready / Missing split as Favorites.
  - **Open questions:** do Favorites become just another list? Can lists hold your own recipes too? Reorder drinks inside a list? Cover art or just a color?
  - **Ties into:** Favorites (`favorites.ts`), the Recipe Book, and Party Mode (a list could become a party menu in one tap, next to the built-in templates). It adds a new data shape (lists of recipe ids) and a store version bump, so it needs a PRD entry first.
  - **Party Mode:** also called "Recipe lists". Party Mode lists it as a later hook: a list becomes a party menu, and "Save this menu as a list" on the Party ended screen. Both are on the PRD Maybe list now.

## Moved to the PRD
- ~~Add a recipe source from Make Now~~ → PRD Later list (with the "Add my own recipe" form)
- ~~History of every bottle I've owned~~ → PRD Later list (built on "past bottles")
- ~~Smarter Unlock counting~~ → PRD Maybe list
- ~~First-run onboarding~~ → PRD section 13 (v1.1)
