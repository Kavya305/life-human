/**
 * One-off: converts the original `content/pieces.ts` array into one markdown
 * file per piece under `content/pieces/`, which is the format the CMS writes.
 *
 * Kept in the repo because the same shape is what a Blogger import would
 * target — see README.
 *
 *   node scripts/migrate-pieces.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const outDir = path.join(root, 'content', 'pieces');

/* The source array is TypeScript, so strip the types and evaluate it as ESM. */
const src = fs.readFileSync(path.join(root, 'content', 'pieces.ts'), 'utf8');
const js = src
  .replace(/^import[\s\S]*?;\s*$/m, '')
  .replace(/export const pieces: Piece\[\] =/, 'export const pieces =');

const tmp = path.join(root, '.pieces.tmp.mjs');
fs.writeFileSync(tmp, js, 'utf8');
const { pieces } = await import(pathToFileURL(tmp).href);
fs.unlinkSync(tmp);

const serializeEssay = (blocks = []) =>
  blocks
    .map((b) => {
      if (b.kind === 'h') return `## ${b.text}`;
      if (b.kind === 'quote')
        return b.attribution ? `> ${b.text}\n> — ${b.attribution}` : `> ${b.text}`;
      if (b.kind === 'claim') return `:::${b.claim}\n${b.text}\n:::`;
      if (b.kind === 'aside') return `:::note\n${b.text}\n:::`;
      return b.text;
    })
    .join('\n\n');

const q = (v) => (typeof v === 'string' ? `"${v.replace(/"/g, '\\"')}"` : String(v));

const frontMatter = (p) => {
  const lines = [];
  const put = (k, v) => {
    if (v === undefined || v === null || v === '') return;
    lines.push(`${k}: ${q(v)}`);
  };

  put('title', p.title);
  put('question', p.question);
  put('pillar', p.pillar);
  put('type', p.type);
  put('seriesSlug', p.seriesSlug);
  put('part', p.part);
  put('date', p.date);
  put('dek', p.dek);
  put('plate', p.plate);
  put('videoId', p.videoId);
  put('minutes', p.minutes);
  if (p.featured) put('featured', true);
  if (p.relatedShorts?.length) lines.push(`relatedShorts: [${p.relatedShorts.map(q).join(', ')}]`);
  if (p.relatedIdeas?.length) lines.push(`relatedIdeas: [${p.relatedIdeas.map(q).join(', ')}]`);
  if (p.sources?.length) {
    lines.push('sources:');
    for (const s of p.sources) {
      lines.push(`  - text: ${q(s.text)}`);
      if (s.detail) lines.push(`    detail: ${q(s.detail)}`);
      if (s.href) lines.push(`    href: ${q(s.href)}`);
    }
  }
  return lines.join('\n');
};

fs.mkdirSync(outDir, { recursive: true });
for (const p of pieces) {
  const file = path.join(outDir, `${p.slug}.md`);
  const body = serializeEssay(p.essay);
  fs.writeFileSync(file, `---\n${frontMatter(p)}\n---\n\n${body}\n`, 'utf8');
}

console.log(`Wrote ${pieces.length} pieces to content/pieces/`);
