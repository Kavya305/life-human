import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { pieces } from '@/lib/pieces';
import { pillarById } from '@/content/pillars';
import { seriesBySlug } from '@/content/series';
import { pieceBySlug, resolveSlugs, nextExploration, worldOf } from '@/lib/content';
import { formatDate, typeLabel } from '@/lib/format';
import { Plate } from '@/components/primitives/Plate';
import { Prose } from '@/components/primitives/Prose';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Reveal } from '@/components/primitives/Reveal';
import { PieceCard } from '@/components/archive/PieceCard';
import styles from './piece.module.css';

/** Every piece is a static route — the archive is finite and known at build. */
export function generateStaticParams() {
  return pieces.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const piece = pieceBySlug(slug);
  if (!piece) return {};

  return {
    title: piece.title,
    description: piece.dek,
    openGraph: {
      type: 'article',
      title: piece.title,
      description: piece.dek,
      publishedTime: piece.date,
    },
  };
}

export default async function PiecePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const piece = pieceBySlug(slug);
  if (!piece) notFound();

  const pillar = pillarById(piece.pillar);
  const inSeries = piece.seriesSlug ? seriesBySlug(piece.seriesSlug) : undefined;
  const shorts = resolveSlugs(piece.relatedShorts);
  const related = resolveSlugs(piece.relatedIdeas);
  const next = nextExploration(piece);
  const world = worldOf(piece);

  return (
    <article data-pillar={piece.pillar}>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <header className={styles.hero}>
        <div className={`shell ${styles.heroText}`}>
          <p className={styles.crumbs}>
            <Link href={`/explore?pillar=${pillar.id}`}>{pillar.name}</Link>
            <span aria-hidden="true">·</span>
            <span>{typeLabel[piece.type]}</span>
            {inSeries && (
              <>
                <span aria-hidden="true">·</span>
                <Link href={`/series/${inSeries.slug}`}>{inSeries.title}</Link>
              </>
            )}
          </p>

          {/* The central question sits above the title, larger than the title,
              because it is what the piece actually is. */}
          <p className={styles.question}>{piece.question}</p>

          <h1 className={styles.title}>{piece.title}</h1>

          <p className={styles.dek}>{piece.dek}</p>

          <p className={styles.meta}>
            <time dateTime={piece.date}>{formatDate(piece.date)}</time>
            {piece.minutes && (
              <>
                <span aria-hidden="true">·</span>
                <span>{piece.minutes} minutes</span>
              </>
            )}
          </p>
        </div>

        <div className={styles.heroPlate} data-world={world} data-paint="">
          <Plate variant={piece.plate} />
        </div>
      </header>

      {/* ── Film ─────────────────────────────────────────────────────── */}
      {(piece.type === 'film' || piece.videoId) && (
        <section className={`shell ${styles.filmWrap}`} aria-label="Film">
          <div className={styles.film} data-world={world} data-paint="">
            {piece.videoId ? (
              <iframe
                className={styles.frame}
                src={`https://www.youtube-nocookie.com/embed/${piece.videoId}`}
                title={piece.title}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <>
                <Plate variant={piece.plate} />
                {/* Honest about its own state rather than faking a player. */}
                <p className={styles.pending}>This film is still being made.</p>
              </>
            )}
          </div>
        </section>
      )}

      {/* ── Essay ────────────────────────────────────────────────────── */}
      {piece.essay?.length ? (
        <section className={`shell-narrow ${styles.body}`} aria-label="Essay">
          <Prose blocks={piece.essay} />
        </section>
      ) : (
        <section className={`shell-narrow ${styles.body}`}>
          <p className={styles.pendingEssay}>
            The written companion to this piece is not published yet.
          </p>
        </section>
      )}

      {/* ── Sources ──────────────────────────────────────────────────── */}
      {piece.sources?.length ? (
        <section className={`shell-narrow ${styles.sources}`} aria-labelledby="sources-h">
          <Eyebrow as="h2">
            <span id="sources-h">Sources &amp; further reading</span>
          </Eyebrow>
          <ul>
            {piece.sources.map((s) => (
              <li key={s.text}>
                <span className={styles.sourceText}>
                  {s.href ? (
                    <a href={s.href} rel="noopener noreferrer" target="_blank">
                      {s.text}
                    </a>
                  ) : (
                    s.text
                  )}
                </span>
                {s.detail && <span className={styles.sourceDetail}>{s.detail}</span>}
              </li>
            ))}
          </ul>
          <p className={styles.sourceNote}>
            Where we have read a source in translation, or relied on a summary,
            we would rather say so than imply more than we have done.
          </p>
        </section>
      ) : null}

      {/* ── Related shorts ───────────────────────────────────────────── */}
      {shorts.length ? (
        <section className={`shell ${styles.related}`} aria-labelledby="shorts-h">
          <Eyebrow as="h2">
            <span id="shorts-h">Shorts from this piece</span>
          </Eyebrow>
          <ul className={styles.shorts}>
            {shorts.map((s) => (
              <li key={s.slug}>
                <PieceCard piece={s} size="compact" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ── Related ideas ────────────────────────────────────────────── */}
      {related.length ? (
        <section className={`shell ${styles.related}`} aria-labelledby="related-h">
          <Eyebrow as="h2">
            <span id="related-h">Related ideas</span>
          </Eyebrow>
          <ul className={styles.shorts}>
            {related.map((r) => (
              <li key={r.slug}>
                <PieceCard piece={r} size="compact" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ── Next ─────────────────────────────────────────────────────── */}
      {next && (
        <Reveal as="section" className={styles.nextWrap}>
          <Link
            href={`/explore/${next.slug}`}
            className={styles.next}
            data-pillar={next.pillar}
          >
            <span className="shell">
              <span className={styles.nextLabel}>Next exploration</span>
              <span className={styles.nextQuestion}>{next.question}</span>
              <span className={styles.nextTitle}>
                {next.title}
                <span className="arrow" aria-hidden="true">
                  {' '}
                  &#8594;
                </span>
              </span>
            </span>
          </Link>
        </Reveal>
      )}
    </article>
  );
}
