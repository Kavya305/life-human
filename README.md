# Life.Human

> What does it mean to be human?

A digital publication and living archive about life, humanity, wisdom and the
ideas that shape the way we live. Built around Tuṣṭi and Puṣṭi — contentment
and nourishment.

```bash
npm install
npm run dev
```

Runs on <http://localhost:4321>.

---

## The one rule

**The site must nourish without creating hunger.**

The attention economy runs on the opposite pair — dissatisfaction and
depletion. A feed leaves you slightly unsatisfied and slightly emptier so that
you come back. Everything here follows from refusing that.

In practice that means: no view counts, no reading-time promises, no trending,
no streaks, no badges, no infinite scroll, no notifications, no share buttons,
nothing that makes leaving feel like a loss. If you are about to add a number
to this site, check first whether it tells a reader what *other people* did.
If it does, it does not belong here.

The other consequence: **the unit of content is a question, not a piece.** On
every card and every article page the central question is set above the title
and larger than it. A question opens and hands the reader authority; an answer
closes and takes it.

---

## Adding content

Two ways in. Both write the same files.

### The editor (what the writer uses)

Go to **`/admin`**, sign in with an email and password, click **New**, write,
click **Publish**. No GitHub account, no code, no keys.

Publishing commits a markdown file to `content/pieces/` and Netlify rebuilds
the site, usually within a minute. Drafts stay in the Workflow tab until they
are set to Ready, so nothing goes live by accident.

Setup, once, in the Netlify dashboard:

1. **Site configuration → Identity → Enable Identity.**
   Set registration to **Invite only** — otherwise anyone could sign up and
   publish.
2. **Identity → Services → Git Gateway → Enable.** This is what lets the
   editor write to the repo without the writer having a GitHub account.
3. **Identity → Invite users** — enter the writer's email. They get a link,
   set a password, and are in.

To add another writer later, invite their email. To remove one, delete them
from the Identity user list; their access is gone immediately.

### By hand

Each piece is one markdown file in `content/pieces/`, front matter plus body:

```markdown
---
title: "The Long Silence"
question: "What do we lose when we are never alone?"   # the real subject
pillar: "think"          # think | understand | discover | question | become
type: "essay"            # film | essay | short | visual
seriesSlug: "life-and-time"
part: 2
date: "2026-06-02"
dek: "One or two sentences that carry the card."
plate: "threshold"
videoId: "abc123"        # optional; omitted renders a waiting state
minutes: 9
featured: true
relatedIdeas: ["enough"]
sources:
  - text: "Blaise Pascal"
    detail: "Pensées, 139"
---

The body, in markdown. See Essay body below.
```

The filename is the web address: `the-long-silence.md` → `/explore/the-long-silence`.

The route, the sitemap entry, the series listing, the archive filters and the
"next exploration" link all follow automatically.

### A new series

Append to `content/series.ts`. Pieces join it by setting `seriesSlug`.

### Essay body

Written as markdown, parsed into a typed `Block[]` before it reaches a
component — so the rendering layer never handles raw HTML. The parser is
`lib/markdown.ts`, about 100 lines, no dependency.

| Syntax | Renders as |
|---|---|
| A line of text | A paragraph |
| `## Heading` | A section heading |
| `> Quoted line` | A pulled quote (`> — Name` adds attribution) |
| `:::note` … `:::` | An editorial aside, quieter than the body |
| `:::fact` … `:::` | **An epistemic marker** — see below |

### Epistemic markers

The most important component in the project. Assertion and speculation look
identical on a page unless someone marks the difference, and on the subjects
this publication works on — history, religion, education, social criticism —
that blurring is where the damage happens.

```markdown
:::fact
Checkable, with a source we will name.
:::

:::interpretation
A reading of the evidence; others may read it differently.
:::

:::hypothesis
Goes beyond what the evidence supports. Worth considering, not settled.
:::

:::question
Genuinely open. We are not going to close it for you.
:::
```

Each kind has its own colour *and* its own dot shape — filled square, diamond,
hollow circle, open corner — so the distinction survives colour blindness and
monochrome print. The legend on `/about` uses the same marks as the essays.

**Use these liberally.** They are the difference between this and every other
ancient-wisdom channel on the internet.

---

## Design system

### Three worlds, one publication

A **world** sets the ground and the ink. A **pillar** sets one accent. Nothing
else changes between sections — that is what keeps five rooms feeling like one
house rather than five brands.

| World | Used by | Ground |
|---|---|---|
| `philosophy` | Think, Become | Warm ivory `#faf6ef` |
| `history` | Understand, Question | Documentary dark `#1a1714` |
| `wisdom` | Discover | Earth / clay `#ede7d9` |

| Pillar | Accent | |
|---|---|---|
| Think | Ink Indigo | `#37476b` |
| Understand | Burnt Bronze | `#8a4b2f` |
| Discover | Aged Ochre | `#7c5c22` |
| Question | Iron Teal | `#3f5551` |
| Become | Olive Leaf | `#586b41` |

Gold `#b08d4f` is for hairlines and marks only — never a fill, never a
gradient.

### `data-world` vs `data-paint`

This distinction matters and is easy to get wrong.

- **`data-world="history"`** *redefines the palette* on an element.
- **`data-paint`** *applies* it — sets background and ink, and republishes the
  `--page-*` tokens for descendants.

They are separate so an element can adopt a world's accent **without** adopting
its ground and ink. A pillar row on the homepage declares the history world
(for its accent and its hover state) while sitting on the cream page; if
declaring a world also painted it, that row would render light text on a cream
background.

When you need the palette of the surface a thing is *actually sitting on*, use
`--page-ink`, `--page-ink-2`, `--page-ink-3`. Custom properties substitute at
computed-value time, so these inherit as literal colours and are not
re-resolved by a descendant that declares a different world.

Accents lift to their lighter twins only under `[data-world='history'][data-paint]`
— on a dark ground that is genuinely painted, never merely declared.

### Contrast

Every ink and accent is checked against both the base and raised ground of
every world. Body and metadata clear 4.5:1; accents used for large type clear
3:1 and mostly clear 4.5:1 too.

**Never dim text with `opacity`.** It silently drops contrast below the checked
values. Use `--ink-2` / `--ink-3`, which are the tokens that were measured.

### Typography

- **Newsreader** — display and long-form body. One family across both is what
  makes it read as one publication.
- **Inter** — navigation and metadata. Set at 11–13px with `0.14em` tracking, a
  UI sans is supposed to disappear; the serif carries the identity.

Both self-hosted via `next/font` — no external request, no layout shift.
Essay body is 20px/1.75 at a 66ch measure. This is a reading site.

### Motion

Animation should feel like breathing, not entertainment. One breath is about
four seconds (`--breath: 4.2s`). Transitions run 260–900ms on a soft ease-out.
Nothing bounces, nothing parallaxes, nothing animates on every element.

`Reveal` handles two failure modes deliberately, because the cost of getting
them wrong is invisible content rather than a missing flourish:

1. **No JavaScript** — the hidden state applies only under
   `html[data-reveal='on']`, set by an inline script. Without JS nothing is
   ever hidden.
2. **A document that starts hidden** — opening a link in a background tab
   leaves `visibilityState === 'hidden'`, and browsers deliver *no*
   IntersectionObserver callbacks in that state. `Reveal` waits for the
   document to become visible before observing.

`prefers-reduced-motion` is honoured throughout, in CSS, so it holds even if
none of the above runs.

---

## Imagery

There is no licensed photography yet, so `<Plate>` holds its place: eight
hand-drawn SVG plates (`arch`, `horizon`, `manuscript`, `threshold`, `orbit`,
`river`, `column`, `aperture`) that take their colour from the surrounding
world and pillar, with a film-grain layer over the top. They weigh nothing and
have no licensing problem.

Shapes use `currentColor` at stepped opacities rather than gradients — it reads
as printed ink rather than screen glow, and it keeps every plate world-aware
without a single hard-coded hex.

**`Plate` is the seam.** When real photography arrives, give it an `image` prop
that renders `next/image`, swap `piece.plate` for `piece.image`, and no caller
changes.

---

## Architecture

Next.js 15 App Router, TypeScript, hand-written CSS with design tokens and CSS
Modules. **Runtime dependencies: `next`, `react`, `react-dom`. That is all.**

No Tailwind: a design this typographic is better served by real tokens and the
cascade, and utility classes would make the three worlds far harder to express
than `[data-world]` scoping does. No animation library: CSS plus one
IntersectionObserver hook.

```
app/          routes, tokens.css, globals.css, sitemap, robots
components/
  site/       Header  Footer
  primitives/ Reveal  Plate  Prose  Eyebrow  PageHeader
  home/       Threshold  Premise  Pillars  FeaturedArchive
              TodayIWill  SeriesStrip  Principles
  archive/    ArchiveBrowser  PieceCard
  piece/      Claim
public/admin/ the CMS: index.html + config.yml
netlify.toml  build settings
content/      types  pillars  series  principles  today  about
content/pieces/  one markdown file per piece
lib/          content (queries)  pieces (loader)  markdown (parser)  format
```

Almost everything is a server component. The only client components are
`Header` (menu state) and `TodayIWill` (the swap).

Hosted on Netlify. That choice is load-bearing: Netlify Identity gives the
writer an email-and-password login with no GitHub account and no OAuth app to
maintain, and it places no restriction on who may push to the repo.

`/explore` is a **server** component and its filters are **links**, not
buttons. Every view of the shelf has a real address: crawlable, linkable,
survives a refresh, works with no JavaScript, and costs nothing in client
bundle. A library's shelves should have addresses.

---

## Before going live

- [ ] Replace the sample content in `content/pieces/`. It is written rather
      than dummied so the typography could be judged honestly — **do not ship
      any of it as established fact.**
- [ ] Enable Identity and Git Gateway in Netlify, set registration to
      **Invite only**, and invite the writer (see above).
- [ ] Set the real domain in `app/layout.tsx` (`site.url`), `app/sitemap.ts`
      and `app/robots.ts`.
- [ ] Point the footer social links at the real accounts.
- [ ] Add `videoId`s as films are published.
- [ ] Add an OG image.

### Things deliberately left out

No newsletter modal, no share buttons, no comments, no analytics. Each is a
decision, not an oversight. If you want any of them, they can be designed in a
way that does not cost the project its character — but the default is their
absence.

And nothing on this site should ever acquire pricing, services, a booking flow,
or growth language. Life.Human is an idea, not a business.
