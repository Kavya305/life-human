import type { MetadataRoute } from 'next';
import { pieces } from '@/content/pieces';
import { series } from '@/content/series';

const base = 'https://lifehuman.example';

/** Static routes plus every piece and series — the archive is known at build. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/explore', '/series', '/journal', '/about', '/today'].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.8,
    }),
  );

  return [
    ...staticRoutes,
    ...pieces.map((p) => ({
      url: `${base}/explore/${p.slug}`,
      lastModified: new Date(`${p.date}T00:00:00Z`),
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
    ...series.map((s) => ({
      url: `${base}/series/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
