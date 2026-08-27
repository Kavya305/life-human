import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    // The editor and its OAuth handler are private tooling, not publication.
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] },
    sitemap: 'https://lifehuman.example/sitemap.xml',
  };
}
