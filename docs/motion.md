---
aliases: [Motion, Animation guide]
tags: [design, motion, v1.4]
---
# Motion guide

[[Home]] · [[prd|PRD]] · [[roadmap|Roadmap]] · [[decisions|Decisions]] · [[brand-kit|Brand kit]]

How Casa Del Cocktail moves. Picked from live samples on Nov 17. Everything here works offline and needs no new libraries: plain CSS transitions and the browser's built-in animation tools are enough.

## The feel

Warm and a little bouncy, like a good board game. Never flashy.

Three rules:

1. **Animate moments of doing or reward only.** Pressing a button, finishing a drink, a bottle changing level, Unlock revealing recipes. Do not animate scrolling, filtering, typing, tab switches, or every row in a list.
2. **Three speeds.** Taps are fast, things appearing or moving are medium, rewards are slow and rare.
3. **Only rewards and button releases get a springy overshoot.** Everything else eases calmly.

## Timing tokens

Put these in one place (CSS variables) so every screen uses the same values.

| Token | Value | Used for |
|---|---|---|
| `--motion-press` | 90 ms, ease-out | Button going down |
| `--motion-release` | 220 ms, spring | Button coming back up |
| `--motion-move` | 450 ms, gentle ease (`cubic-bezier(.4, 0, .2, 1)`) | Bottle level changes |
| `--ease-out` | `cubic-bezier(.22, .8, .3, 1)` | Things appearing |
| `--ease-spring` | `cubic-bezier(.34, 1.56, .64, 1)` | Releases and rewards only |

## The five picks

### 1. Button press: Squish
- Press: shrinks to 94% in 90 ms (ease-out).
- Release: springs back in 220 ms (`--ease-spring`).
- **Applies to:** every pill button (primary and secondary) and the round Home button.
- **Does not apply to:** tab bar items, filter chips, text links, list rows.

### 2. Pour: Fill rise
Plays when you tap **I made this** on a recipe page. About 1.4 s.
- The drink rises in the glass over 700 ms.
- The glass wobbles once (350 ms).
- A green check pops in with a spring (350 ms).
- Afterward the glass stays full with the check showing until you leave the page.
- **I made this** logs quietly. It does not change bottle levels, because the app cannot know how much was poured.

### 3. Unlock reveal: Count and burst
About 1.3 s. Uses the starburst badge, which stays reserved for Unlock.
- The starburst pops in with a small twist (550 ms, spring).
- The number counts up from +0 to the real count over 700 ms.
- 10 small shapes (dots, diamonds, four-point stars) burst out and fade, in Atomic Garden colors: Amber, Mustard, Teal, Rust, Avocado.
- **Where it plays (needs your OK):** the top suggestion's badge on the Unlock screen, once each time the screen opens, and when adding a bottle makes new recipes possible. Other badges on the screen stay still.

### 4. Bottle fill: Settle
- A bottle drawing whose liquid slides to the new level over 450 ms with a gentle ease and no overshoot.
- Four levels only: Full, Half, Low, Empty. The level word is always shown next to the drawing, so nothing depends on the picture or its color.
- **Applies to:** Bar Cart rows, next to the level control.
- **Does not apply to:** Past bottles (nothing changes level there).

### 5. Sound: none for now
Left out of v1.4. If it comes back, it should be off by default with its own switch in Settings, separate from reduce motion.

## Reduce motion

The app follows the device's own "reduce motion" setting automatically. No extra switch in Settings for now.

When it is on:

| Normally | With reduce motion |
|---|---|
| Squish | Button only darkens while pressed |
| Fill rise | Glass is simply full, check showing |
| Count and burst | Badge fades in over 200 ms, final number shown, no shapes |
| Settle | Liquid jumps straight to the new level |

## Where it goes in the app

| Screen | Motion |
|---|---|
| All screens | Squish on pill buttons and the Home button |
| Bar Cart | Bottle drawing with Settle on each bottle row |
| Recipe detail | **I made this** button, then Fill rise |
| Unlock | Count and burst on the top suggestion |
| Add items (after adding) | Count and burst if new recipes become possible |
| Make Now, Recipes, Past bottles, Settings | No new motion |

## New things this needs

- **I made this** button on recipe detail (new feature). It records that the drink was made. That is a small data change, so the store version goes up.
- A bottle drawing component (Full, Half, Low, Empty).
- One shared motion file for the timing tokens and a tiny "is reduce motion on?" helper.

## Out of scope

Sound effects, changing bottle levels automatically when a drink is made, animation on lists, filters, tabs and page changes.

## Roadmap steps (suggested)

Small steps, in this order:

1. **M.1** Motion tokens and the reduce-motion helper. No visible change.
2. **M.2** Squish on all pill buttons and the Home button.
3. **M.3** Bottle drawing with Settle in Bar Cart rows.
4. **M.4** **I made this** button and Fill rise on recipe detail, with the small data change.
5. **M.5** Count and burst on Unlock, and after adding a bottle.
6. **M.6** Check pass: reduce motion on and off, on a real phone, nothing janky.

## Reference

The live samples this was picked from are on a Claude page called "Casa Motion Samples". If you want to change a pick later, reopen it and choose again.
