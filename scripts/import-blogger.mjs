/**
 * Imports posts from a Blogger (Google Takeout) export into content/pieces/.
 *
 *   node --experimental-strip-types scripts/import-blogger.mjs <feed.atom> [...]
 *   node --experimental-strip-types scripts/import-blogger.mjs --dry <feed.atom>
 *
 * Only published posts are imported. Drafts are listed and skipped — putting
 * someone's unpublished writing on a live site is not a decision a script
 * should make.
 *
 * The two fields the design actually turns on — the central question and the
 * pillar — cannot be derived from a blog post. The pillar is guessed from the
 * post's labels and the question is left blank, so nothing is silently
 * mislabelled. Both are then editable at /admin.
 */
import fs from 'node:fs';
import path from 'node:path';
import { htmlToMarkdown } from '../lib/markdown.ts';

const A = '{http://www.w3.org/2005/Atom}';
const B = '{http://schemas.google.com/blogger/2018}';

const args = process.argv.slice(2);
const dry = args.includes('--dry');
/* Drafts are excluded unless asked for, and even then they arrive marked as
   drafts so nothing unpublished becomes public by importing it. */
const includeDrafts = args.includes('--drafts');
/* Limit the run to particular pieces, so refreshing one post cannot disturb
   edits made to the others since they were imported. */
const only = (args.find((a) => a.startsWith('--only=')) || '').replace('--only=', '')
  .split(',').map((s) => s.trim()).filter(Boolean);
const feeds = args.filter((a) => !a.startsWith('--'));
if (!feeds.length) {
  console.error('Usage: import-blogger.mjs [--dry] <feed.atom> [...]');
  process.exit(1);
}

const OUT = path.join(process.cwd(), 'content', 'pieces');

/* ── Tiny XML reader ─────────────────────────────────────────────────
   The export is a flat Atom feed, so a full XML parser would be a
   dependency for no benefit. */
function entries(xml) {
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1]);
}
const decode = (s) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, '&');

function tag(entry, name) {
  const m = entry.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]).trim() : '';
}
/* Takeout quotes attributes with ", the public feed with '. Both, then. */
function attrOf(entry, name, attr) {
  const m = entry.match(new RegExp(`<${name}[^>]*\\b${attr}=["']([^"']*)["']`));
  return m ? decode(m[1]) : '';
}

/* ── Mapping ─────────────────────────────────────────────────────── */

/* The writer's own labels are the best signal there is, so an explicit label
   wins outright over anything guessed from the words. */
const LABEL_TO_PILLAR = {
  'ancient wisdom': 'discover',
  'sanatan wisdom': 'discover',
  'sanātana wisdom': 'discover',
  'vedic knowledge': 'discover',
  'vedic cosmology': 'discover',
  'śrīmad-bhāgavatam': 'discover',
  'bhagavad gita': 'discover',
  'history & society': 'understand',
  history: 'understand',
  society: 'understand',
  philosophy: 'think',
  'human nature': 'think',
  'life lessons': 'become',
};

/* Otherwise: score every pillar, weighting the title most and the body least,
   and take the winner. First-match ordering pulled almost everything into one
   pillar because devotional vocabulary appears throughout the prose. */
const PILLAR_TERMS = {
  discover: /bh[āa]gavat|bhagavad|gita|purāṇ|vedic|ved[āa]nta|san[āa]tana?|scripture|verse|canto|cosmolog|gotra|saptarishi|kr[iṛ][sṣ]h?[nṇ]a|vi[sṣ][nṇ]u|n[āa]r[āa]ya[nṇ]a|radha|devi|goddess|temple|deity|divine|ancient text/gi,
  understand: /histor|civilizat|empire|dynasty|colonial|revolution|freedom struggle|citizen|governance|economy|economic|gdp|currency|dollar|bretton|petrodollar|trade|nation|bharat|thanesar|sth[āa]ne|archaeolog|inscription/gi,
  question: /compet|competit|consumeris|advertis|market|exam|examinat|school|education|career|doctor|engineer|coaching|rat race|status|coaching|algorithm|social media|technolog|hustle/gi,
  become: /practice|discipline|habit|service|seva|character|humility|patience|today i will|how to live|daily/gi,
  think: /philosoph|meaning of life|purpose|suffer|happiness|content|ego|love|relationship|death|time|solitude|psycholog|human nature|inner/gi,
};

function guessPillar(title, labels, text) {
  for (const l of labels) {
    const hit = LABEL_TO_PILLAR[l.trim().toLowerCase()];
    if (hit) return hit;
  }

  const scores = { discover: 0, understand: 0, question: 0, become: 0, think: 0 };
  const weigh = (source, weight) => {
    for (const [pillar, re] of Object.entries(PILLAR_TERMS)) {
      scores[pillar] += ((source.match(re) || []).length) * weight;
    }
  };
  weigh(title, 6);
  weigh(labels.join(' '), 4);
  weigh(text.slice(0, 2500), 1);

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best[1] > 0 ? best[0] : 'think';
}

const PLATES = {
  discover: 'manuscript',
  understand: 'column',
  question: 'orbit',
  become: 'horizon',
  think: 'aperture',
};

/* Recognises "Bhāgavatam Series — Part 2", "Creation Series - Part 02", etc. */
function detectSeries(title) {
  const part = title.match(/part\s*[-—:/]?\s*0*(\d+)/i);
  const n = part ? Number(part[1]) : undefined;
  if (/bh[āa]gavatam\s*series|śr[īi]mad-bh[āa]gavatam\s*-\s*part/i.test(title))
    return { seriesSlug: 'srimad-bhagavatam', part: n };
  if (/sth[āa]ne[śs]|thanesar/i.test(title))
    return { seriesSlug: 'history-of-bharat', part: n };
  // "Creation Series" is its own sequence. Grouping it under an existing
  // series would be an editorial decision, so it is left unset.
  return {};
}

const slugify = (s) =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70) || 'untitled';

const q = (v) => (typeof v === 'string' ? `"${v.replace(/"/g, '\\"')}"` : String(v));

/* ── Run ─────────────────────────────────────────────────────────── */

const imported = [];
const skipped = [];
const seen = new Set();

for (const feed of feeds) {
  const xml = fs.readFileSync(feed, 'utf8');
  const blog = path.basename(path.dirname(feed));

  /* Two shapes: a Takeout export carries blogger:* elements, while the blog's
     own public feed is plain Atom and marks post-ness with a category. */
  const isTakeout = xml.includes('schemas.google.com/blogger/2018');

  for (const e of entries(xml)) {
    /* The /feeds/posts/default endpoint returns posts only, so there is
       nothing to filter on the public side. */
    if (isTakeout && tag(e, 'blogger:type') !== 'POST') continue;

    /* A draft never appears in the public feed, so anything found there is
       published by definition. */
    const status = isTakeout ? tag(e, 'blogger:status') : 'LIVE';
    const trashed = isTakeout ? tag(e, 'blogger:trashed') : '';
    let title = tag(e, 'title');
    const html = tag(e, 'content');
    const dek = isTakeout ? tag(e, 'blogger:metaDescription') : '';
    const published = (tag(e, 'published') || tag(e, 'blogger:created')).slice(0, 10);

    /* Takeout packs every label into one newline-joined term; the public feed
       uses one category element per label. */
    const labels = isTakeout
      ? (attrOf(e, 'category', 'term') || '').split('\n').filter(Boolean)
      : [...e.matchAll(/<category[^>]*term=["']([^"']*)["']/g)].map((m) => decode(m[1]));

    const filename = isTakeout
      ? tag(e, 'blogger:filename')
      : (e.match(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']*)["']/) || [, ''])[1];

    let body = htmlToMarkdown(html);

    /* A post's first picture becomes its cover, so the archive shows the
       writer's own photographs rather than a wall of drawn panels. It is
       lifted out of the body so it does not appear twice on the page. */
    let cover = '';
    const firstImage = body.match(/^!\[([^\]]*)\]\(([^)\s]+)\)\s*$/m);
    if (firstImage) {
      cover = firstImage[2];
      body = body.replace(firstImage[0], '').replace(/\n{3,}/g, '\n\n').trim();
    }

    const plain = body.replace(/[#>*_]/g, ' ');

    const isDraft = status !== 'LIVE';
    if (trashed || (isDraft && !includeDrafts)) {
      skipped.push({ blog, title: title || '(untitled)', why: trashed ? 'in trash' : 'draft', published });
      continue;
    }

    /* One post carries no title of its own; its real title is the first
       heading in the body. Guard against picking up an empty heading. */
    if (!title) {
      const heading = [...body.matchAll(/^##\s+(.+)$/gm)]
        .map((m) => m[1].trim())
        .find((h) => h.length > 8);
      const line = body
        .split('\n')
        .map((l) => l.replace(/^#+\s*/, '').trim())
        .find((l) => l.length > 12);
      title = (heading || line || 'Untitled').slice(0, 90);
    }

    /* Prefer Blogger's own URL for the address, so old links stay meaningful. */
    let slug = slugify(
      (decodeURIComponent(filename).split('/').pop() || '').replace(/\.html$/i, '') || title,
    );
    while (seen.has(slug)) slug = `${slug}-2`;
    seen.add(slug);

    if (only.length && !only.includes(slug)) continue;

    /* Refreshing an existing piece must not discard editorial work: the
       central question and description are written here, never in Blogger. */
    const existing = path.join(OUT, `${slug}.md`);
    let keptQuestion = '';
    let keptDek = '';
    if (fs.existsSync(existing)) {
      const prior = fs.readFileSync(existing, 'utf8');
      keptQuestion = (prior.match(/^question:\s*"([\s\S]*?)"\s*$/m) || [, ''])[1];
      keptDek = (prior.match(/^dek:\s*"([\s\S]*?)"\s*$/m) || [, ''])[1];
    }

    const pillar = guessPillar(title, labels, plain);
    const { seriesSlug, part } = detectSeries(title);
    const words = plain.split(/\s+/).filter(Boolean).length;

    const fm = [];
    fm.push(`title: ${q(title)}`);
    fm.push(`question: ${q(keptQuestion)}`); // blank unless already written here
    fm.push(`pillar: ${q(pillar)}`);
    fm.push(`type: "essay"`);
    if (seriesSlug) fm.push(`seriesSlug: ${q(seriesSlug)}`);
    if (part) fm.push(`part: ${part}`);
    fm.push(`date: ${q(published)}`);
    const finalDek = dek || keptDek;
    if (finalDek) fm.push(`dek: ${q(finalDek)}`);
    if (cover) fm.push(`cover: ${q(cover)}`);
    fm.push(`plate: ${q(PLATES[pillar])}`);
    fm.push(`minutes: ${Math.max(1, Math.round(words / 200))}`);
    if (isDraft) fm.push('draft: true');

    const file = path.join(OUT, `${slug}.md`);
    if (!dry) {
      fs.mkdirSync(OUT, { recursive: true });
      fs.writeFileSync(file, `---\n${fm.join('\n')}\n---\n\n${body}\n`, 'utf8');
    }
    imported.push({ blog, title, slug, pillar, seriesSlug, part, words, isDraft, dek: Boolean(dek) });
  }
}

const pad = (s, n) => String(s).padEnd(n).slice(0, n);
console.log(`\n${dry ? 'WOULD IMPORT' : 'IMPORTED'} ${imported.length} posts\n`);
console.log(pad('PILLAR', 11) + pad('WORDS', 7) + pad('SERIES', 22) + 'TITLE');
console.log('-'.repeat(96));
for (const p of imported.sort((a, b) => a.pillar.localeCompare(b.pillar))) {
  console.log(
    pad(p.pillar, 11) +
      pad(p.words, 7) +
      pad(p.seriesSlug ? `${p.seriesSlug}${p.part ? ` #${p.part}` : ''}` : '—', 22) +
      (p.isDraft ? '[draft] ' : '') +
      p.title,
  );
}
if (skipped.length) {
  console.log(`\nSKIPPED ${skipped.length} (not published):`);
  for (const s of skipped) console.log(`  ${s.published}  ${s.why.padEnd(8)} ${s.title}`);
}
console.log('\nEvery imported piece has a blank central question — fill those in at /admin.');
