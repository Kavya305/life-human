import fs from 'node:fs';
import path from 'node:path';
import type { Piece, PieceType, PillarId, PlateVariant, Source } from '@/content/types';
import { parseEssay, parseFrontMatter } from './markdown';

/**
 * Reads every piece from `content/pieces/*.md` at build time.
 *
 * Content lives as one markdown file per piece rather than as a TypeScript
 * array, because the CMS writes files — it cannot edit a TS literal. Parsing
 * happens once at module load; every route is statically generated, so this
 * never runs in a request path and never reaches the browser.
 */

const DIR = path.join(process.cwd(), 'content', 'pieces');

const PILLARS: PillarId[] = ['think', 'understand', 'discover', 'question', 'become'];
const TYPES: PieceType[] = ['film', 'essay', 'short', 'visual'];
const PLATES: PlateVariant[] = [
  'arch', 'horizon', 'manuscript', 'threshold', 'orbit', 'river', 'column', 'aperture',
];

const str = (v: unknown, fallback = ''): string =>
  typeof v === 'string' ? v : typeof v === 'number' ? String(v) : fallback;

/**
 * Accepts whatever a writer actually has to hand: a watch link, a share link,
 * a Shorts link, an embed link, or a bare id. Asking someone to dig the id out
 * of a URL is asking them to do the computer's job.
 */
export function youtubeId(input: string): string {
  const value = input.trim();
  if (!value) return '';
  if (/^[\w-]{11}$/.test(value)) return value;

  const patterns = [
    /[?&]v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /\/shorts\/([\w-]{11})/,
    /\/embed\/([\w-]{11})/,
    /\/live\/([\w-]{11})/,
  ];
  for (const re of patterns) {
    const hit = value.match(re);
    if (hit) return hit[1];
  }
  return '';
}

const strList = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];

function readOne(file: string): Piece | null {
  const raw = fs.readFileSync(path.join(DIR, file), 'utf8');
  const { data, body } = parseFrontMatter(raw);

  const slug = str(data.slug) || file.replace(/\.md$/, '');
  const title = str(data.title);
  if (!title) return null;

  /* An unrecognised pillar or type would break the design silently — fall
     back to something valid and let the build warn instead. */
  const pillar = PILLARS.includes(data.pillar as PillarId)
    ? (data.pillar as PillarId)
    : 'think';
  const type = TYPES.includes(data.type as PieceType)
    ? (data.type as PieceType)
    : 'essay';
  const plate = PLATES.includes(data.plate as PlateVariant)
    ? (data.plate as PlateVariant)
    : 'aperture';

  if (!PILLARS.includes(data.pillar as PillarId)) {
    console.warn(`[content] ${file}: missing or unknown pillar — defaulted to "think".`);
  }

  const sources: Source[] = Array.isArray(data.sources)
    ? (data.sources as Record<string, unknown>[])
        .filter((s) => s && typeof s === 'object' && str(s.text))
        .map((s) => ({
          text: str(s.text),
          ...(str(s.detail) ? { detail: str(s.detail) } : {}),
          ...(str(s.href) ? { href: str(s.href) } : {}),
        }))
    : [];

  const essay = parseEssay(body.trim());

  return {
    slug,
    title,
    question: str(data.question),
    pillar,
    type,
    ...(str(data.seriesSlug) ? { seriesSlug: str(data.seriesSlug) } : {}),
    ...(typeof data.part === 'number' ? { part: data.part } : {}),
    date: str(data.date, '1970-01-01').slice(0, 10),
    dek: str(data.dek),
    plate,
    ...(str(data.cover) ? { cover: str(data.cover) } : {}),
    ...(str(data.coverAlt) ? { coverAlt: str(data.coverAlt) } : {}),
    ...(youtubeId(str(data.videoId)) ? { videoId: youtubeId(str(data.videoId)) } : {}),
    ...(typeof data.minutes === 'number' ? { minutes: data.minutes } : {}),
    ...(essay.length ? { essay } : {}),
    ...(sources.length ? { sources } : {}),
    ...(strList(data.relatedShorts).length ? { relatedShorts: strList(data.relatedShorts) } : {}),
    ...(strList(data.relatedIdeas).length ? { relatedIdeas: strList(data.relatedIdeas) } : {}),
    ...(data.featured === true ? { featured: true } : {}),
    ...(data.draft === true ? { draft: true } : {}),
  };
}

function load(): Piece[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map(readOne)
    .filter((p): p is Piece => p !== null);
}

/** Everything on disk, drafts included. Only tooling should need this. */
export const allFiles: Piece[] = load();

/**
 * What the site is allowed to show.
 *
 * Drafts are filtered out here rather than at each call site, so a route,
 * a listing or the sitemap cannot accidentally leak one by forgetting to
 * check. Nothing downstream has to know drafts exist.
 */
export const pieces: Piece[] = allFiles.filter((p) => !p.draft);
