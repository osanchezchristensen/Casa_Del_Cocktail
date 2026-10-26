---
aliases: [Brand Kit]
tags: [casa, brand]
---
# Casa Del Cocktail: Brand Kit

[[Home]] · [[project-brief|Brief]] · [[prd|PRD]] · [[screens/README|Screens]]

**Version:** 0.1 (prototype edition) | **Date:** October 12, 2026

This is a light brand kit: enough to make the prototype look and sound like Casa Del Cocktail. The logo and polished copy come later. To see the colors and fonts, open `brand-preview.html` (in this folder) in your browser.

---

## 1. Name meaning

**Casa Del Cocktail** is a playful twist on "house of the cocktail." It's your home bar, treated as a little cocktail house that friends drop into. There's no deeper story, and the brand shouldn't invent one. The name carries the warmth and hospitality, so the rest of the brand can stay calm.

**Short name:** "Casa" works in casual copy ("Welcome back to Casa").

## 2. Personality

**Atomic Garden, light mode:** a 1960s home bar on a sunny afternoon. Warm amber, mustard and avocado green on cream, with rounded organic shapes. Nostalgic and cozy, never kitschy.

| We are | We are not |
|---|---|
| Warm, welcoming, a good host | Loud, salesy, "party app" |
| Mid-century, nostalgic | Tiki, kitsch, costume-y |
| Quietly witty | Punny in every line |
| Clear and helpful | Snobby or full of jargon |

**Hard rules:** no tiki imagery (no tiki masks, palm-frond clichés or carved-wood fonts), no neon, no fake wood grain, no script fonts.

## 3. Tone of voice: the friendly host

The app talks like a relaxed host behind your own bar cart: it notices what you have, suggests something good, and never makes you feel you're missing out.

**Guidelines**
- **Lead with what you *can* do.** "You can make 12 cocktails" comes before "you're missing 3 things."
- **One light touch of wit per screen, at most.** Wit goes in empty states and small moments, never in buttons or errors.
- **Plain words.** Say "orange liqueur," and explain cocktail terms the first time if needed.
- **Short sentences.** People read this standing at a cart with a glass in hand.
- **Never pushy about drinking.** No "you need another drink" energy.

### Sample copy

| Moment | Copy |
|---|---|
| First open | **Welcome to Casa.** Let's see what's on your bar cart. |
| Onboarding prompt | Tap everything you've got. You can always add more later. |
| Empty bar cart | Your cart's looking a little bare. Add a bottle or two and we'll find you a drink. |
| Results header | **You can make 14 cocktails tonight.** |
| No matches yet | Nothing quite yet, but you're close. Here's what one more bottle would open up. |
| One more ingredient | **Add Campari** to unlock 6 more cocktails, including the Negroni. |
| Item marked Low | Running low on rye. Want it on your refill list? |
| Item marked Empty | Rye's empty. We'll leave those recipes off the list for now. |
| Favorited | Saved to your favorites. |
| Source tag on a card | From *[Book Title]*, p. 42 |
| Export success | Your bar cart is backed up. Keep that file somewhere safe. |
| Import success | Welcome back. Your cart is just as you left it. |
| Error (generic) | Something went wrong on our end. Try that again? |
| Responsible drinking (footer) | Made for enjoying, not overdoing. Please drink responsibly. |

**Button labels stay plain:** "Add to cart," "Save," "Mark as low," "Export my cart."

## 4. Color palette: Atomic Garden

| Role | Name | Hex | Use it for |
|---|---|---|---|
| Background | Cream | `#F5ECD7` | Page background |
| Surface | Paper | `#FBF6EA` | Cards, sheets, inputs |
| Text | Walnut | `#3B2A1E` | All main text and headings |
| Muted text | Cork | `#6E5A47` | Secondary text, captions, source tags |
| Primary | Amber | `#D98E2B` | Big decorative shapes, highlights, active tab backgrounds (with Walnut text) |
| Primary action | Deep Amber | `#A0570F` | Buttons (with Paper text), links |
| Accent | Mustard | `#E3B23C` | Starbursts, badges, "Full" level (with Walnut text) |
| Success / can make | Avocado | `#5A6B22` | "You can make this," checkmarks |
| Secondary | Teal | `#2C6863` | Filters, book tags, secondary buttons |
| Alert | Rust | `#A8442A` | "Empty," destructive actions, errors |

**Readability rules** (contrast-checked):
- Text on Cream or Paper: use **Walnut, Cork, Deep Amber, Avocado, Teal or Rust**. All pass.
- **Never** put Amber or Mustard text on cream. They're too light. Use them as fills with Walnut text on top.
- Button: Deep Amber fill with Paper text.
- Don't rely on color alone. Every status also has a word or icon (for example, "Low" plus a half-empty icon).

**Bottle level colors**

| Level | Color | Label |
|---|---|---|
| Full | Mustard fill, Walnut text | Full |
| Half | Amber fill, Walnut text | Half |
| Low | Paper fill, Rust outline and text | Low (refill flag) |
| Empty | Rust fill, Paper text | Empty |

## 5. Typography

Both fonts are free from Google Fonts.

| Use | Font | Weight | Notes |
|---|---|---|---|
| Headings, app name, big numbers | **Righteous** | Regular (only weight) | Rounded, 1960s signage feel. Use for short text only: titles, cocktail names, "14 cocktails" |
| Body, buttons, labels | **DM Sans** | 400 regular, 500 medium, 700 bold | Warm, clean, very readable |

**Sizes (starting point)**
- App title: 32px Righteous
- Screen heading: 24px Righteous
- Cocktail name on card: 20px Righteous
- Body: 16px DM Sans
- Small labels and source tags: 13-14px DM Sans, Cork color

**Rules:** never set paragraphs in Righteous. Don't use all-caps Righteous for more than 2-3 words.

## 6. UI feel

**Mid-century shapes, modern clarity.** Retro shows up in color and shape, never in textures or illustrations.

- **Corners:** generous and soft. Cards 20px, buttons fully rounded (pill-shaped), inputs 12px.
- **Organic shapes:** one soft amber or mustard "blob" or boomerang curve behind each screen header. That's decoration enough.
- **Starburst badge:** a small mustard starburst for "+6 cocktails" on the "one more ingredient" suggestions. This is the app's signature detail. Use it only there.
- **Cards:** Paper surface on Cream background, a subtle warm shadow, no borders.
- **Icons:** simple line icons (the Lucide icon set works well with React), in Walnut or Cork.
- **Spacing:** airy. Let things breathe, since the app is used while standing.
- **Motion:** gentle and quick (about 150-200ms fades and slides). Nothing bouncy.
- **Imagery:** none needed for the prototype. Cocktail cards can show a simple glass-shape icon (coupe, rocks, highball, martini) in place of photos.

## 7. Logo direction (for later)

Not needed for the prototype. When we get to it, directions to explore:
- A **wordmark** in a rounded retro face, with "Casa" emphasized
- A small **icon**: a coupe glass inside a soft arch (a doorway, for "casa"), or a coupe with an atomic starburst
- Colors: Walnut on Cream, with an Amber or Mustard accent

For the prototype, the app name set in Righteous is the logo.

---

## Quick reference for Claude Code

```
Colors:  cream #F5ECD7 | paper #FBF6EA | walnut #3B2A1E | cork #6E5A47
         amber #D98E2B | deep-amber #A0570F | mustard #E3B23C
         avocado #5A6B22 | teal #2C6863 | rust #A8442A
Fonts:   headings "Righteous"; body "DM Sans" (400/500/700) via Google Fonts
Shapes:  cards radius 20px, pill buttons, inputs radius 12px, warm soft shadows
Rules:   light mode only; no amber/mustard text on cream; no tiki, neon,
         wood grain or script fonts; never rely on color alone for status
Voice:   friendly host, plain words, at most one light joke per screen
```
