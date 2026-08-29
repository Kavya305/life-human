/**
 * Where the site lives.
 *
 * Read from the environment rather than written down, because a hardcoded
 * address goes stale silently: it was already wrong once, and the only
 * visible symptom was that shared links showed a broken preview image.
 *
 * Netlify sets `URL` to the site's primary address at build time, so setting
 * the custom domain as primary in the dashboard is enough — the next build
 * picks it up with no code change. `NEXT_PUBLIC_SITE_URL` overrides it for
 * anyone hosting this elsewhere.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.URL ||
  'https://life-human.netlify.app'
).replace(/\/$/, '');

export const site = {
  name: 'Life.Human',
  question: 'What does it mean to be human?',
  tagline: 'Question. Think. Choose Humanity.',
  description:
    'A better world begins with a better human. Life.Human is an exploration of life, humanity, wisdom and the ideas that shape the way we live.',
  url: siteUrl,
};
