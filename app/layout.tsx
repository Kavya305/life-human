import type { Metadata, Viewport } from 'next';
import { Newsreader, Inter } from 'next/font/google';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import './globals.css';

/**
 * Two families, self-hosted by next/font — no external request, no layout
 * shift. Newsreader carries the identity across display and body; Inter is set
 * small and wide for metadata, where a sans is supposed to disappear.
 */
const newsreader = Newsreader({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
  axes: ['opsz'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const site = {
  name: 'Life.Human',
  question: 'What does it mean to be human?',
  description:
    'Life.Human is an exploration of life, humanity, wisdom and the ideas that shape the way we live. A growing archive of human questions.',
  url: 'https://lifehuman.example',
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.question}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    'philosophy',
    'humanity',
    'ancient wisdom',
    'history',
    'human development',
    'meaning',
    'contentment',
  ],
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: `${site.name} — ${site.question}`,
    description: site.description,
    locale: 'en',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.question}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#faf6ef',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The inline script in <head> stamps data-reveal on <html> before
    // hydration, so the live element carries an attribute React did not
    // render. suppressHydrationWarning covers this element's own attributes
    // only — it hides nothing further down the tree.
    <html
      lang="en"
      className={`${newsreader.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Marks the document as able to animate, before first paint. Without
            JavaScript this never runs and every Reveal stays plainly visible
            rather than transparent. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.setAttribute('data-reveal','on')",
          }}
        />
      </head>
      <body>
        <a href="#main" className="skip">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
