---
aliases: [Party Mode, Party plan]
tags: [casa, party, planned, online]
---
# Party Mode

[[Home]] · [[prd|PRD]] · [[roadmap|Roadmap]] · [[decisions|Decisions]] · [[motion|Motion guide]] · [[brand-kit|Brand kit]] · [[ideas|Ideas]]

**Status: planned, not scheduled.** Designed on Nov 17, 2026 so the online version can be built with Party Mode in mind. Nothing here is built yet. The mockups are on the design canvas (see "Screens" below).

This is the first feature that needs a server. The rest of the app stays offline-first: the cart, the matching and Make Now never need the internet.

## What it is

A host plans a drinks party. They pick a menu, the app works out what that menu still needs, and friends open a link in their browser and say what they'll bring. Everyone sees which drinks will be possible. The host can print the menu.

## The idea in one example

Taco Night, 6 guests, 8 drinks on the menu. The host's cart covers 2 of them. Lime juice would open 6 more, so the host asks guests for it. Sam says "I'll bring ginger beer", Priya brings mint, and Jo brings grapefruit soda. The menu fills in as people claim things.

## Decisions at a glance

- **Guests use a browser link, with no install and no account.** Name only. They confirm they are 21 or older.
- **The host keeps a private host link** in their browser. One active party at a time in the first version. A Party Host screen for several parties comes later.
- **Menu first.** The host picks drinks from templates or the full catalog. The app computes what the menu still needs. The host then sends those as requests.
- **Live while planning, locked when final.** **Finalize** locks the menu for printing. The host can unlock it.
- **Privacy:** guests see ingredient names only. Never levels, bottle names, the host's cart or the host's name.
- **The link expires 7 days after the party date.** The data is then deleted.
- **No book recipes in party menus** (they are private). Custom recipes aren't available yet.
- **Matching is unchanged.** The party reuses `matchRecipe` and `unlockSuggestions` with a merged set of ingredient ids.
- **Print is A4**, in a color version and a simplified black-and-white version.

## User stories

| # | Story | Priority |
|---|---|---|
| P1 | As a host, I want to create a party with a name and date and get a link to share. | Must |
| P2 | As a host, I want to pick drinks from templates or the full catalog for my menu. | Must |
| P3 | As a host, I want to see which menu drinks I can already make, and what the rest still need. | Must |
| P4 | As a host, I want to ask guests for the missing items, or mark the ones I'll get myself. | Must |
| P5 | As a guest, I want to open a link, enter my name and see what the host needs. | Must |
| P6 | As a guest, I want to say "I'll bring this", or add something else I'm bringing. | Must |
| P7 | As a host, I want to see who is bringing what, and remove a claim if needed. | Must |
| P8 | As a host, I want to finalize the menu and print it on A4 in color or black and white. | Should |
| P9 | As a guest, I want to see the menu and which drinks are ready or "coming once X arrives". | Should |
| P10 | As a host, I want a copyable shopping list for what I'm getting. | Should |
| P11 | As a user, I want clear messages when I'm offline, a link is wrong, or the party has ended. | Must |

## Screens

Mockups live on the design canvas, in the two rows "Party Mode (planned)". Mobile width, 390 px. Print pages are A4 (794 x 1123 px).

### Host
| Screen | What's on it |
|---|---|
| **Party home** (`PartyHome`) | Name, date, guest count, "Live" line. Share card with **Copy** and **Copy host link**. Rows: Guests and items, Drinks possible, Still needed (starburst count and top item). Party menu card with a Draft tag, **Pick drinks** and **Preview menu**. Responsible-drinking note. |
| **Party just created** (`PartyJustCreated`) | Same layout with "Nobody's here yet", the link to copy, and muted rows. |
| **Pick drinks** (`PartyPickDrinks`) | Search. Template carousel (Taco night, Classics, Easy and cheap). Filter chips. Sections: Ready with what's on the cart, Needs 1 more item, Needs 2 or more. "Show all N drinks". Bottom bar with the picked count, items still needed and **See what it needs**. |
| **What the menu needs** (`PartyMenuNeeds`) | "N of M drinks ready" with a segmented bar. **Still needed** items with an **Ask guests** switch and **I'll get it**. **Guests are bringing**. **Already on your cart**. Bottom bar: **Send to guests**, **Copy shopping list**. |
| **Guests and items** (`PartyGuests`) | By guest / By item. Cards per guest with their items. Dashed chips for "Something else" items. Remove a claim. **Copy guest link**. |
| **Menu preview** (`PartyMenuPreview`) | The menu grouped by base spirit, with Ready / "Coming once lime juice arrives". Draft tag. **Finalize menu**, **Print: color**, **Print: black and white**. |
| **Menu is final** (`PartyMenuFinal`) | Lock banner, Final pill, the menu, **Unlock to edit**, print buttons. |
| **Printed menu, color** (`PartyMenuPrint`) and **black and white** (`PartyMenuPrintBW`) | A4. Title, two columns of drinks by spirit, a "Not drinking?" box, responsible-drinking line. No status words on paper. |

### Guest
| Screen | What's on it |
|---|---|
| **Join the party** (`GuestJoin`) | Name field and an "I'm 21 or older" checkbox on one screen. |
| **Party page: Bring** (`GuestParty`) | Tabs Bring / Drinks / Menu. "The host is looking for" cards with a starburst count and **I'll bring this**. "You're bringing" (with an empty state). "Already covered". |
| **Party page: Drinks** (`GuestDrinks`) | Unlock-style card for the top missing item, then drinks grouped as Ready, Coming once X arrives, Needs more. |
| **Party page: Menu** (`GuestMenu`) | The menu with a Draft or Final tag and a short note. |
| **Add something** (`GuestAddItems`) | Ingredient search from the app's list, Add / Added buttons, and a dashed "Bringing something else?" free-text box. |

### States
| Screen | What's on it |
|---|---|
| **Opening the link: loading** (`GuestLoading`) | Soft gray skeleton and "Opening the party…". |
| **Link not found** (`GuestLinkNotFound`) | "This link doesn't work", with a tip and **Try again**. |
| **Party ended** (`GuestPartyEnded`) | "That was a good one." with a link to Casa Del Cocktail. |
| **Offline banner** (`OfflineBanner`) | Mustard banner "You're offline"; actions that need the network are disabled. |
| **Error messages** (`ErrorMessages`) | "Couldn't save that" (guest) and "Couldn't create your party" (host). Plain words, no blame, a way to try again. |

## Rules

### Who sees what
- **Guests see:** party name, date, guest first names, the menu, which ingredients the host chose to show, who is bringing what.
- **Guests never see:** bottle levels, bottle names or brands, the host's cart, the host's name or account details.
- The host chooses which of their ingredients appear. Only **ingredient ids** are sent for those, never bottles.

### The menu
- The menu is a list of **recipe ids**. Only starter recipes can be on it. Book recipes are excluded. A test checks this.
- The party uses the **host's Allow swaps** setting, which the host can change for the party. It is stored on the party so guests see the same results.
- **Menu status** for each drink uses the existing matching on the **party pool**: the host's shown ingredients plus every ingredient a guest has claimed. A drink is **Ready** if it matches with the pool, **Coming once X arrives** if the only missing ingredients are requested or claimed-but-not-yet-confirmed items, and **Needs more** otherwise.
- **Still needed** is the existing Unlock logic run against the menu drinks only, so each item shows how many menu drinks it would open (the starburst number).

### Requests and claims
- A **request** is an ingredient the host wants. Each has a mode: **Ask guests** (guests can claim it) or **I'll get it** (the host brings it; guests see it as covered).
- The first **Send to guests** is explicit. After that, changes sync live.
- A **claim** is a guest saying they'll bring an ingredient, or a free-text "something else". Free text doesn't affect drink matching.
- Duplicate claims are allowed, with a nudge ("Sam's already bringing this").
- The host can remove any claim. A guest can remove only their own.

### Lifetime
- The menu is **Draft** (live) until the host taps **Finalize**. Final locks drinks and requests. Guests can still add items. **Unlock to edit** returns to Draft.
- The party link stops working **7 days after the party date**. All party data (guests, claims, menu) is deleted then. The Party ended screen shows after the date while the link still resolves.
- One active party per host in the first version.

### Safety and brand
- Guests confirm they are 21 or older before joining. The responsible-drinking note shows on the Party home, the guest page and the printed menu.
- The mustard starburst badge is used **only** for Unlock-style suggestions (the "Still needed" counts and the guest Drinks card). Not for statuses.
- Status always uses a word and an icon, never color alone.
- Motion follows the [[motion|Motion guide]]; see the table at the end of this page.

## Data model

Types go in `src/types.ts` (or a `src/party/types.ts`). All ids are random strings. Nothing here stores bottles.

```ts
type Party = {
  id: string
  joinCode: string          // short unguessable code in the guest link
  hostKey: string           // secret in the host link; never shown to guests
  name: string              // "Taco Night"
  date: string              // ISO date of the party
  createdAt: string
  expiresAt: string         // date + 7 days; the server deletes after this
  allowSwaps: boolean
  status: 'draft' | 'final'
  menu: string[]            // recipe ids (starter recipes only)
  shownIngredientIds: string[] // ingredient ids the host chose to show
}

type Guest = { id: string; partyId: string; name: string; joinedAt: string }

type Request = {
  id: string
  partyId: string
  ingredientId: string
  mode: 'ask' | 'host'      // Ask guests / I'll get it
  sent: boolean             // false until the first "Send to guests"
}

type Claim = {
  id: string
  partyId: string
  guestId: string
  ingredientId: string | null // from the app's list
  freeText: string | null     // "Something else"; one of the two is set
  note?: string
  createdAt: string
}
```

On the host's device only (kept in the browser, like the cart): `{ partyId, hostKey }` for the active party. If the browser data is cleared and the host link is lost, the party can't be managed.

**Matching on the client.** Each device runs the existing matching logic with `poolIds = shownIngredientIds ∪ claimed ingredientIds`. No recipe data needs to live on the server, only recipe ids. The pure logic goes in `src/logic/party.ts` (no React), with tests.

## What the online part must do

The backend is **not chosen yet**. One small free hosted database service with live updates is enough (Supabase and Firebase were both considered). Decide in step P.0 and log it in [[decisions|Decisions]]. Ask before adding any package.

Needs:
1. **Create a party** and return the join code and host key.
2. **Read a party** by join code (public data only) with live updates.
3. **Host writes** (menu, requests, status, remove any claim, delete party) allowed only with the host key.
4. **Guest writes** (join, add or remove their own claim) allowed only for their own guest id.
5. **Expiry:** delete the party and its guests, requests and claims after `expiresAt`.
6. **Basic limits:** cap guests per party (about 30), name length (about 40) and free-text length, and rate-limit writes.
7. **No accounts and no email.** The join code and host key must be long enough to be unguessable.

**Hosting gotcha.** The demo runs on GitHub Pages, which only serves real files. A guest link such as `/party/k7x2` would show a 404 on refresh. Use a hash router for the party routes (`/#/party/k7x2`) or add a 404 page that redirects. Decide in P.0.

**Not in the first version:** guest sign-in, opening links inside an installed app (needs a PWA, and only works on some phones), a Party Host screen for several parties, push notifications.

## Roadmap steps

Phase 12 for [[roadmap|Roadmap]]. Each step is one session. Offline steps first, so the logic and screens can be built and checked before any server exists.

### P.0 Choose the online service
**Prompt:**
> Read `docs/party-mode.md`, "What the online part must do". Compare two or three free hosted options in plain language (cost, limits, how live updates work, how hard it is to learn). Recommend one, and also decide how guest links work on GitHub Pages (hash router or a 404 redirect). Don't install anything yet. Write the choice into `docs/decisions.md` once I agree.

**Done when:**
- [ ] I picked a service and a link style
- [ ] The decision is in `docs/decisions.md` with the reason
- [ ] No code changed

### P.1 Party logic (offline, pure TypeScript)
**Prompt:**
> Read `docs/party-mode.md` (Rules, Data model). Add the party types and `src/logic/party.ts`: the party pool, menu status for each drink (Ready / Coming / Needs more), the Still needed list with open counts for the menu, and the three templates. Reuse `matchRecipe` and `unlockSuggestions`. Don't touch the matching rules. Tests for each rule.

**Done when:**
- [ ] Types match the data model
- [ ] Tests cover: pool merging, Ready / Coming / Needs more, Still needed counts, book recipes excluded, Allow swaps on and off, empty menu
- [ ] The existing matching tests still pass
- [ ] `npm test`, `npm run build` and `npm run lint` pass

### P.2 Host screens with local data (no server)
**Prompt:**
> Open the mockups `PartyHome`, `PartyJustCreated` and `PartyPickDrinks`. Build the Party home and Pick drinks screens using local data only (saved in the browser), including search, templates, filters and the picked-count bar. Add a link to Party mode that is hidden until the feature is on. Match the mockups; follow the PRD if they disagree and tell me.

**Done when:**
- [ ] I can create a local party, pick drinks and see Ready / Needs counts
- [ ] Screens match the mockups; brand tokens and CSS Modules used
- [ ] Store version bump and a migration, if the saved shape changed (ask first)

### P.3 What the menu needs
**Prompt:**
> Open `PartyMenuNeeds`. Build the screen with the Still needed list, the Ask guests switch, I'll get it, and Copy shopping list. Sending to guests does nothing yet (disabled with "Coming with the online step").

**Done when:**
- [ ] Switches change the request mode; the shopping list copies as plain text
- [ ] Starburst is used only on the Still needed counts
- [ ] Matches the mockup

### P.4 Menu preview, Finalize and print
**Prompt:**
> Open `PartyMenuPreview`, `PartyMenuFinal`, `PartyMenuPrint` and `PartyMenuPrintBW`. Build the preview, Finalize / Unlock, and two print layouts for A4 using print CSS (no new package). Black and white must use black ink only, no blobs, no colors.

**Done when:**
- [ ] Both print versions fit one A4 page in the browser's print preview
- [ ] Finalize locks the menu; Unlock to edit reverses it
- [ ] The responsible-drinking line is on the printout

### P.5 The online service: create, read, join
**Prompt:**
> Using the choice in `decisions.md`, set up the service. Ask before installing the package. Build create party, read party, guest join and the security rules from `docs/party-mode.md`. Put all network code in one folder (`src/party/`) so the screens never call the service directly. Add the 7-day expiry. Test the rules where possible.

**Done when:**
- [ ] A party created on my laptop opens on my phone from the link
- [ ] A guest can't change host data, and a wrong host key is refused
- [ ] The app still works fully offline outside Party Mode
- [ ] Keys and secrets are not in git

### P.6 Guest screens
**Prompt:**
> Open `GuestJoin`, `GuestParty`, `GuestDrinks`, `GuestMenu` and `GuestAddItems`. Build them with live updates. Guests can claim a request, add something else, and remove their own claim. Show the duplicate nudge.

**Done when:**
- [ ] Two phones see each other's claims within a few seconds
- [ ] Guests never see levels, bottle names or the host's name
- [ ] The 21+ checkbox is required

### P.7 Host: send, guests and items
**Prompt:**
> Open `PartyGuests` and finish **Send to guests** on `PartyMenuNeeds`. The first send is explicit; later changes sync live. The host can remove any claim.

**Done when:**
- [ ] Guests see nothing until the first send
- [ ] By guest and By item views both work
- [ ] Removing a claim updates the guest's screen

### P.8 Loading, offline, errors and expiry
**Prompt:**
> Open `GuestLoading`, `GuestLinkNotFound`, `GuestPartyEnded`, `OfflineBanner` and `ErrorMessages`. Build them and wire them to real conditions: slow load, bad code, past the party date, no network, failed save.

**Done when:**
- [ ] Each state appears in the right situation
- [ ] Buttons that need the network are disabled when offline, with a reason

### P.9 Motion, brand check and release
**Prompt:**
> Add the motion from the table at the end of `docs/party-mode.md`, using the helpers from the Motion guide. Then check every Party screen against its mockup and the brand rules (starburst use, word plus icon for status, no amber text on cream). Update README and `decisions.md`. Choose the version number with me.

**Done when:**
- [ ] Motion follows the table and the reduce-motion rules
- [ ] A full test run on two phones passes
- [ ] README mentions Party Mode, and the hosting note is correct
- [ ] Release tagged

## Motion in Party Mode

Uses the five picks from the [[motion|Motion guide]]. Pour and Bottle fill are not used here.

| Screen | Moment | Motion |
|---|---|---|
| All | Any pill button press | Squish |
| Party home | Copy, then the label changes to "Copied" | Squish, then label swap |
| Pick drinks | A drink is added | The bottom-bar count ticks up with a small bounce |
| What the menu needs | I'll get it | Squish; the row slides into "On your cart" |
| What the menu needs | First Send to guests | Squish, then a quiet "Sent" (no burst) |
| Menu is final | Finalize | Squish, then the lock banner fades in |
| Guest Bring / Drinks | I'll bring this | Squish; the card moves into "You're bringing" |
| Guest Bring / Drinks | The host adds a request | Fades in at the top, no bounce |
| Unlock-style cards | Cards open | Count and burst, once per open |
| Guest Add items | Add becomes Added | Squish, then a check mark |
| Loading | Skeleton | Soft pulse; still when reduce motion is on |
| Offline banner | Appears | Slides in, no bounce |

## Later hooks (not part of this plan)

- **Party Host screen** to manage several parties.
- **Guest sign-in** and opening links inside the installed app (needs the PWA and accounts steps).
- **Seasonal templates** (see [[ideas|Ideas]]).
- **Recipe lists:** a "Save this menu as a list" button on the Party ended screen, and a list that becomes a party menu in one tap (see [[ideas|Ideas]]). Both need the lists feature first.
- **Custom recipes** in menus, once "Add my own recipe" exists.
- A Letter / A4 paper choice.
