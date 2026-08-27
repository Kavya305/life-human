/**
 * Re-encodes everything in public/uploads/ for the web and updates the
 * markdown references.
 *
 *   node scripts/optimise-images.mjs [--dry]
 *
 * Images imported from a blog arrive at whatever size they were uploaded —
 * here, 43 full-resolution PNGs totalling 88 MB. Serving those would undo
 * the point of a site built to load fast and read calmly.
 *
 * Uses sharp, which arrives with Next rather than as a dependency of its own,
 * because this is a one-off local task rather than part of the build.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const dry = process.argv.includes('--dry');
const UPLOADS = path.join(process.cwd(), 'public', 'uploads');
const PIECES = path.join(process.cwd(), 'content', 'pieces');

/* Wide enough for a full-bleed figure on a large screen, and no wider. */
const MAX_WIDTH = 1800;
const QUALITY = 82;

const sourceFiles = fs
  .readdirSync(UPLOADS)
  .filter((f) => /\.(png|jpe?g)$/i.test(f));

let before = 0;
let after = 0;
const renames = new Map();
const kept = [];

for (const file of sourceFiles) {
  const src = path.join(UPLOADS, file);
  const size = fs.statSync(src).size;
  before += size;

  const image = sharp(src);
  const meta = await image.metadata();
  const target = file.replace(/\.(png|jpe?g)$/i, '.webp');
  const dest = path.join(UPLOADS, target);

  if (dry) {
    console.log(`  ${file}  ${(size / 1024).toFixed(0)}KB  ${meta.width}x${meta.height} -> ${target}`);
    continue;
  }

  const buf = await image
    .rotate() // honour EXIF orientation before resizing
    .resize({ width: Math.min(meta.width ?? MAX_WIDTH, MAX_WIDTH), withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer();

  /* Only take the re-encode if it is actually smaller. */
  if (buf.length < size) {
    fs.writeFileSync(dest, buf);
    fs.unlinkSync(src);
    renames.set(file, target);
    after += buf.length;
  } else {
    kept.push(file);
    after += size;
  }
}

if (dry) process.exit(0);

/* Point the markdown at the new filenames. */
let touched = 0;
for (const f of fs.readdirSync(PIECES).filter((n) => n.endsWith('.md'))) {
  const p = path.join(PIECES, f);
  const original = fs.readFileSync(p, 'utf8');
  let next = original;
  for (const [from, to] of renames) next = next.split(`/uploads/${from}`).join(`/uploads/${to}`);
  if (next !== original) {
    fs.writeFileSync(p, next, 'utf8');
    touched++;
  }
}

const mb = (n) => (n / 1024 / 1024).toFixed(1);
console.log(
  `${sourceFiles.length} images: ${mb(before)} MB -> ${mb(after)} MB ` +
    `(${Math.round((1 - after / before) * 100)}% smaller), ${touched} pieces updated`,
);
if (kept.length) console.log(`left as they were (already small): ${kept.join(', ')}`);
