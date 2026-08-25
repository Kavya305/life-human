import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { series, seriesBySlug } from '@/content/series';
import { pillarById } from '@/content/pillars';
import { piecesInSeries } from '@/lib/content';
import { formatDate, typeLabel } from '@/lib/format';
import { Plate } from '@/components/primitives/Plate';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Reveal } from '@/components/primitives/Reveal';
import styles from './seriesDetail.module.css';

export function generateStaticParams() {
  return series.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = seriesBySlug(slug);
  if (!s) return {};
  return {
    title: s.title,
    description: s.description,
    openGraph: { type: 'website', title: s.title, description: s.description },
  };
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = seriesBySlug(slug);
  if (!s) notFound();

  const pillar = pillarById(s.pillar);
  const parts = piecesInSeries(s.slug);

  return (
    <div data-pillar={s.pillar}>
      <header className={styles.hero}>
        <div className="shell">
          <p className={styles.crumbs}>
            <Link href="/series">Series</Link>
            <span aria-hidden="true">·</span>
            <Link href={`/explore?pillar=${pillar.id}`}>{pillar.name}</Link>
          </p>

          <h1 className={styles.name}>{s.title}</h1>
          {s.altTitle && <p className={styles.alt}>{s.altTitle}</p>}
          <p className={styles.question}>{s.question}</p>
          <p className={styles.description}>{s.description}</p>
        </div>

        <div className={styles.plate} data-world={pillar.world} data-paint="">
          <Plate variant={s.plate} />
        </div>
      </header>

      <section className={`shell ${styles.parts}`} aria-labelledby="parts-h">
        <Eyebrow as="h2">
          <span id="parts-h">
            {parts.length} {parts.length === 1 ? 'piece' : 'pieces'} so far
          </span>
        </Eyebrow>

        {/* A series is an ordered reading, so it is set as a numbered list
            rather than a grid of cards. */}
        {parts.length ? (
          <ol className={styles.list}>
            {parts.map((piece, i) => (
              <Reveal as="li" key={piece.slug} delay={i * 60}>
                <Link href={`/explore/${piece.slug}`} className={styles.row}>
                  <span className={styles.part} aria-hidden="true">
                    {String(piece.part ?? i + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.rowText}>
                    <span className={styles.rowQuestion}>{piece.question}</span>
                    <span className={styles.rowTitle}>{piece.title}</span>
                    <span className={styles.rowDek}>{piece.dek}</span>
                  </span>
                  <span className={styles.rowMeta}>
                    {typeLabel[piece.type]}
                    <span aria-hidden="true"> · </span>
                    <time dateTime={piece.date}>{formatDate(piece.date)}</time>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ol>
        ) : (
          <p className={styles.empty}>
            This series has been begun but not yet published. It will appear
            here as it is written.
          </p>
        )}

        <p className={styles.continuing}>
          This series is continuing. New pieces are added as the work is done,
          rather than to a schedule.
        </p>
      </section>
    </div>
  );
}
