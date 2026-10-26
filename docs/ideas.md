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

## Moved to the PRD
- ~~Add a recipe source from Make Now~~ → PRD Later list (with the "Add my own recipe" form)
- ~~History of every bottle I've owned~~ → PRD Later list (built on "past bottles")
- ~~Smarter Unlock counting~~ → PRD Maybe list
