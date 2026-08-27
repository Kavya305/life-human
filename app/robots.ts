import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    // The editor is private tooling, not part of the publication.
    rules: { userAgent: '*', allow: '/', disallow: ['/admin'] },
    sitemap: 'https://lifehuman.example/sitemap.xml',
  };
}
