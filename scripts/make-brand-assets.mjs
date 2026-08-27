/**
 * Derives the site's brand assets from the logo artwork.
 *
 *   node scripts/make-brand-assets.mjs
 *
 * The supplied logo is a lockup: the circular emblem with the wordmark and
 * tagline beneath it, on a warm cream that does not match the site's ivory.
 * The header already sets the wordmark as live text, so it needs the emblem
 * alone, and it needs it without a background box.
 *
 * So: find the emblem by its own ink, crop to it, then flood fill inwards
 * from the edges to clear the background. A flood fill rather than a colour
 * threshold, because the sun inside the ring is nearly the same cream as the
 * backdrop and a threshold would eat it.
 *
 * Re-run this if the logo is ever redrawn.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE = 'public/uploads/life-human-logo-411c0e77.webp';
const GROUND = '#faf6ef';

if (!fs.existsSync(SOURCE)) {
  console.error(`Logo not found at ${SOURCE}`);
  process.exit(1);
}

/* ── Find the emblem ─────────────────────────────────────────────── */
const grey = await sharp(SOURCE).greyscale().raw().toBuffer({ resolveWithObject: true });
const { width: SW, height: SH } = grey.info;

let minX = SW, maxX = -1, minY = SH, maxY = -1;
for (let y = 0; y < SH * 0.62; y++) {
  for (let x = 0; x < SW; x++) {
    if (grey.data[y * SW + x] < 90) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

const pad = 14;
const crop = {
  left: Math.max(0, minX - pad),
  top: Math.max(0, minY - pad),
  width: Math.max(maxX - minX, maxY - minY) + pad * 2,
  height: Math.max(maxX - minX, maxY - minY) + pad * 2,
};

/* ── Clear the background ────────────────────────────────────────── */
const { data, info } = await sharp(SOURCE)
  .extract(crop)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width: W, height: H, channels: C } = info;
const bg = [data[0], data[1], data[2]];
const isBackground = (i) =>
  Math.abs(data[i] - bg[0]) + Math.abs(data[i + 1] - bg[1]) + Math.abs(data[i + 2] - bg[2]) < 60;

const seen = new Uint8Array(W * H);
const stack = [];
for (let x = 0; x < W; x++) stack.push([x, 0], [x, H - 1]);
for (let y = 0; y < H; y++) stack.push([0, y], [W - 1, y]);

while (stack.length) {
  const [x, y] = stack.pop();
  if (x < 0 || y < 0 || x >= W || y >= H) continue;
  const p = y * W + x;
  if (seen[p]) continue;
  const i = p * C;
  if (!isBackground(i)) continue;
  seen[p] = 1;
  data[i + 3] = 0;
  stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}

const mark = () => sharp(Buffer.from(data), { raw: { width: W, height: H, channels: C } });

/* ── Write the assets ────────────────────────────────────────────── */
const written = [];
const write = async (p, buf) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, buf);
  written.push(`${p}  ${(buf.length / 1024).toFixed(0)}KB`);
};

/* The header mark, transparent so it sits on any of the three worlds. */
await write('public/mark.webp', await mark().resize(256).webp({ quality: 92 }).toBuffer());

/* Favicon. Transparent, so it works on light and dark browser chrome. */
await write('app/icon.png', await mark().resize(512).png().toBuffer());

/* iOS refuses transparency on home-screen icons, so this one gets the ground. */
await write(
  'app/apple-icon.png',
  await sharp({ create: { width: 180, height: 180, channels: 4, background: GROUND } })
    .composite([{ input: await mark().resize(156).png().toBuffer(), top: 12, left: 12 }])
    .png()
    .toBuffer(),
);

/* The card a shared link shows: the full lockup, centred on the site ground.
   The lockup's own cream is warmer than the site's ivory, so left as a square
   it reads as a box sitting on the page. Clearing its background the same way
   lets it sit on the ground seamlessly. */
const clearBackground = async (input) => {
  const { data: d, info: i } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = i;
  const base = [d[0], d[1], d[2]];
  const flat = (n) =>
    Math.abs(d[n] - base[0]) + Math.abs(d[n + 1] - base[1]) + Math.abs(d[n + 2] - base[2]) < 60;

  const done = new Uint8Array(w * h);
  const todo = [];
  for (let x = 0; x < w; x++) todo.push([x, 0], [x, h - 1]);
  for (let y = 0; y < h; y++) todo.push([0, y], [w - 1, y]);
  while (todo.length) {
    const [x, y] = todo.pop();
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    const p = y * w + x;
    if (done[p]) continue;
    const n = p * c;
    if (!flat(n)) continue;
    done[p] = 1;
    d[n + 3] = 0;
    todo.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  return sharp(Buffer.from(d), { raw: { width: w, height: h, channels: c } }).png().toBuffer();
};

const lockup = await sharp(await clearBackground(SOURCE))
  .resize({ height: 520, fit: 'inside' })
  .png()
  .toBuffer();
const lockupMeta = await sharp(lockup).metadata();
await write(
  'app/opengraph-image.png',
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: GROUND } })
    .composite([
      {
        input: lockup,
        top: Math.round((630 - (lockupMeta.height ?? 520)) / 2),
        left: Math.round((1200 - (lockupMeta.width ?? 520)) / 2),
      },
    ])
    .png()
    .toBuffer(),
);

console.log(`emblem found at ${JSON.stringify(crop)}\n`);
for (const line of written) console.log('  ' + line);
