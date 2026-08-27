/**
 * Downloads remote images referenced by content/pieces/*.md into
 * public/uploads/, and rewrites the markdown to point at the local copies.
 *
 *   node scripts/localise-images.mjs [--dry]
 *
 * Imported posts point at Blogger's CDN. That works until the original blog
 * changes or goes away, at which point the pictures silently break. Pulling
 * them into the repo makes the site independent of anything Google keeps
 * serving.
 *
 * Safe to re-run: anything already downloaded is skipped, and only URLs that
 * actually fetched are rewritten.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const dry = process.argv.includes('--dry');
const PIECES = path.join(process.cwd(), 'content', 'pieces');
const UPLOADS = path.join(process.cwd(), 'public', 'uploads');

const EXT_BY_TYPE = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/avif': '.avif',
  'image/svg+xml': '.svg',
};

const files = fs.readdirSync(PIECES).filter((f) => f.endsWith('.md'));

/* Collect every remote URL, and which files mention it. */
const urls = new Map();
for (const f of files) {
  const text = fs.readFileSync(path.join(PIECES, f), 'utf8');

  /* Read URLs only from the two places that hold one: a markdown image and
     the cover field. A bare scan for http… breaks on filenames containing an
     apostrophe, which silently truncates the URL and corrupts the rewrite. */
  const found = [
    ...[...text.matchAll(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => m[1]),
    ...[...text.matchAll(/^cover:\s*"(https?:\/\/[^"]+)"/gm)].map((m) => m[1]),
  ];

  for (const url of found) {
    if (!/googleusercontent|blogspot/.test(url)) continue;
    if (!urls.has(url)) urls.set(url, new Set());
    urls.get(url).add(f);
  }
}

console.log(`${urls.size} remote images referenced by ${files.length} pieces`);
if (dry) {
  for (const [u, where] of urls) console.log(`  ${[...where].join(', ')}\n    ${u}`);
  process.exit(0);
}

fs.mkdirSync(UPLOADS, { recursive: true });

/* Blogger encodes a display size in the path. Asking for a larger one gives a
   better original; if that 404s we fall back to the URL as written. */
const upscaled = (url) => url.replace(/\/s\d{2,4}(-c)?\//, '/s1600/');

const nameFor = (url, ext) => {
  const base =
    decodeURIComponent(url.split('/').pop() || '')
      .split('?')[0]
      .replace(/\.[a-z0-9]+$/i, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'image';
  const hash = crypto.createHash('sha1').update(url).digest('hex').slice(0, 8);
  return `${base}-${hash}${ext}`;
};

const rewrites = new Map();
let downloaded = 0;
let bytes = 0;
const failed = [];

for (const [url] of urls) {
  let res = null;
  for (const candidate of [upscaled(url), url]) {
    try {
      const r = await fetch(candidate, { redirect: 'follow' });
      if (r.ok) {
        res = r;
        break;
      }
    } catch {
      /* try the next candidate */
    }
  }

  if (!res) {
    failed.push(url);
    continue;
  }

  const type = (res.headers.get('content-type') || '').split(';')[0].trim();
  const ext = EXT_BY_TYPE[type];
  if (!ext) {
    /* Not an image — leave the link exactly as it is. */
    failed.push(`${url} (served ${type || 'unknown type'})`);
    continue;
  }

  const buf = Buffer.from(await res.arrayBuffer());
  const name = nameFor(url, ext);
  const dest = path.join(UPLOADS, name);
  if (!fs.existsSync(dest)) {
    fs.writeFileSync(dest, buf);
    downloaded++;
    bytes += buf.length;
  }
  rewrites.set(url, `/uploads/${name}`);
}

/* Rewrite the markdown only for URLs that genuinely came down. */
let touched = 0;
for (const f of files) {
  const p = path.join(PIECES, f);
  const before = fs.readFileSync(p, 'utf8');
  let after = before;
  for (const [remote, local] of rewrites) after = after.split(remote).join(local);
  if (after !== before) {
    fs.writeFileSync(p, after, 'utf8');
    touched++;
  }
}

console.log(
  `downloaded ${downloaded} images (${(bytes / 1024 / 1024).toFixed(1)} MB), ` +
    `rewrote ${touched} pieces`,
);
if (failed.length) {
  console.log(`\n${failed.length} left pointing at the original host:`);
  for (const f of failed) console.log(`  ${f}`);
}
