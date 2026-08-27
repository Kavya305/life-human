/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  async rewrites() {
    // The CMS is a static page in public/admin; this lets it answer at /admin
    // rather than only at /admin/index.html.
    return [{ source: '/admin', destination: '/admin/index.html' }];
  },

  async headers() {
    // The editor is a private tool, not part of the publication.
    return [{ source: '/admin', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] }];
  },
};

export default nextConfig;
