import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    // The editor is private tooling, not part of the publication.
    rules: { userAgent: '*', allow: '/', disallow: ['/admin'] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
