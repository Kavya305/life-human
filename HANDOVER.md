# Life.Human — handover

Paste this into a new chat to pick the project up cold. Written 18 September 2026.

**Read [README.md](README.md) first** — it holds the design system, the content
model and the rules the site is built on. This file covers what the README
can't: accounts, history, decisions already settled, and what is still open.

---

## Who is who

- **Kavya** (`Kavya305` on GitHub, singalz.ldh@gmail.com) — the developer. Owns
  the deploying repo and the Netlify account.
- **The client** — the writer and owner of Life.Human. Non-technical. Has a
  GitHub account (`life-human26`) but does not use it; he publishes through the
  CMS with an email and password.

Keep replies short. Long explanatory answers do not get read.

---

## Where everything lives

| Thing | Where |
|---|---|
| Code | `D:\newera\life-human` |
| Repo (deploys from this one) | `github.com/Kavya305/life-human` — private |
| Live site | <https://life-human.netlify.app> |
| Editor | <https://life-human.netlify.app/admin> |
| Host | Netlify, Kavya's account |
| Domain bought, not yet live | **lifehuman.in** |
| His blog (source of the content) | <https://life-jgn.blogspot.com> |

`D:\newera` also contains `newera-solar` and `crm` — a **completely unrelated**
solar business CRM. Do not mix them up.

There is a second, abandoned repo at `life-human26/life-human-portfolio` (the
client's own account). It holds an early copy and is **not** what deploys.
Ignore it.

---

## Stack

Next.js 15 (App Router), TypeScript, hand-written CSS with design tokens.
**Runtime dependencies: `next`, `react`, `react-dom`. Nothing else.** No
Tailwind, no animation library, no UI kit. Keep it that way.

Content is markdown files in `content/pieces/`, read at build time by
`lib/pieces.ts`. No database, no CMS service — the repo is the single source of
truth.

Dev server runs on port **4321** (`npm run dev`).

---

## The CMS

Decap CMS at `/admin`, configured in `public/admin/config.yml`.

- Login is **Netlify Identity** — email and password, no GitHub account needed.
- Registration must stay **Invite only**. Otherwise anyone can sign up and publish.
- **Git Gateway** is what lets it commit to the repo on the writer's behalf.
- Publishing commits a markdown file and Netlify rebuilds, about a minute.
- `publish_mode: editorial_workflow` — saving makes a draft; it goes live via
  the **Workflow** tab → drag to Ready → Publish. People get stuck here: *Save
  does not publish.*

**A config that fails validation kills the entire editor**, not just one field.
After any change to `config.yml`, load `/admin` and confirm the login screen
appears. This already broke once (`modes: [raw, rich]` — the valid value is
`rich_text`).

---

## Content

21 markdown files in `content/pieces/` — **19 published, 2 drafts**. All
imported from his Blogger blogs; none of the original sample content remains.

- `draft: true` hides a piece completely: no page, no listing, no sitemap entry.
  Filtered once in `lib/pieces.ts` so no route can leak one.
- **`question` is blank on every imported piece.** It is the field the whole
  design is built around, and only he can write it. Pages render fine without
  it — the title takes the display size instead.
- Filenames are the URLs, and they match his old Blogger slugs on purpose.
- 52 images live in `public/uploads`, all local. Nothing loads from Blogger.

### Importing more from Blogger

The importer reads **both** a Google Takeout export and the blog's live public
feed, so no export is needed:

```bash
curl -s "https://life-jgn.blogspot.com/feeds/posts/default?max-results=500" -o .import/live-feed.xml
node --experimental-strip-types scripts/import-blogger.mjs --dry .import/live-feed.xml
```

Flags: `--dry` previews, `--drafts` includes unpublished posts (marked
`draft: true`), `--only=slug1,slug2` limits the run. A re-import **preserves**
any `question` and `dek` already written here — those don't exist in Blogger and
would otherwise be wiped.

Then always:

```bash
node scripts/localise-images.mjs && node scripts/optimise-images.mjs
```

Imported images arrive as full-size PNGs. The last batch was 89 MB before
re-encoding and 8.9 MB after.

### The other scripts

| Script | Does |
|---|---|
| `import-blogger.mjs` | Blogger → `content/pieces/*.md` |
| `localise-images.mjs` | Downloads remote images into `public/uploads`, rewrites links |
| `optimise-images.mjs` | Re-encodes uploads to WebP ≤1800px |
| `make-brand-assets.mjs` | Derives logo, favicon and OG image from the artwork |
| `migrate-pieces.mjs` | One-off, already run. Kept for reference |

---

## Decisions already made — don't reopen

**Netlify, not Vercel.** Vercel's Hobby plan refuses to build any commit whose
author isn't the account owner, on private repos. That blocks the developer or
the client, whichever doesn't own the account — and the client's CMS posts are
commits authored by him. Deploy hooks don't bypass it. Netlify has no such
limit and its Identity gives the writer an email login with no OAuth app to
maintain. Two days went into learning this.

**Videos are not uploaded to the site.** A git repo behind a static host is the
wrong place for video. Films live on his YouTube channel and embed in the page.
The CMS field takes any YouTube link (watch, share, Shorts, embed, or a bare id)
and extracts the id itself.

**No products, pricing, services, booking, metrics or growth language, ever.**
Life.Human is an idea, not a business. An app advertisement was raised and then
withdrawn by the client.

**The site URL is read from the environment**, not hardcoded — `lib/site.ts`
uses Netlify's `URL` variable. A hardcoded domain already went stale once and
silently broke every shared link's preview image. Setting a custom domain as
primary in Netlify is now enough; no code change.

**`public/uploads/birth01.png` (2.2 MB) is left alone deliberately.** The client
uploaded it and may want it for a future draft. Nothing references it.

---

## Still open

1. **Point lifehuman.in at the site.** Blocked on a registrar problem. In
   Netlify: Domain management → Add domain → either switch the registrar's
   nameservers to Netlify's four, or add `A @ 75.2.60.5` and
   `CNAME www life-human.netlify.app`. Then **set it as primary** and trigger a
   deploy. No code change needed.
2. **The central questions** are blank on all imported pieces. His job.
3. **Check the pillar guesses** — they were inferred from his Blogger labels.
   "Kangra 2026" landed in Discover and may belong in Understand.
4. **CMS uploads aren't compressed.** Images added through `/admin` stay
   full-size while imported ones are ~250 KB. Offered, not yet built.
5. **Two remaining drafts** — `material-world-and-spiritual-world`, `untitled`.

---

## Working notes — things that waste time if you don't know them

- **Bash heredocs on this machine mangle backslashes.** A Python heredoc doing
  `s.replace('\\b...')` silently matches nothing and reports success. Any edit
  involving regexes or escapes: **use the Edit tool**, and verify the result.
  This caused several silent no-op "fixes".
- **`npm run build` overwrites `.next` underneath a running dev server**, which
  then serves stale output and looks like your change didn't apply. Restart the
  dev server after a production build.
- **The browser pane can't take screenshots** in this setup, and in a hidden tab
  `IntersectionObserver` never fires and `loading="lazy"` images never load — so
  reveals and images report as missing when they're fine. Verify with
  `read_page`, computed styles, and forced eager loads instead.
- **Netlify deploys take 1–5 minutes.** Poll with curl for a string you expect;
  don't assume a push is live.
- The site has **no analytics and no view counts** by design. Don't add any.
