import type { Metadata } from 'next';
import { allPieces } from '@/lib/content';
import { pillarById } from '@/content/pillars';
import { PageHeader } from '@/components/primitives/PageHeader';
import { ArchiveBrowser } from '@/components/archive/ArchiveBrowser';
import type { PieceType, PillarId } from '@/content/types';
import styles from './explore.module.css';

const validPillars = ['think', 'understand', 'discover', 'question', 'become'];
const validTypes = ['film', 'essay', 'visual', 'short'];

type Search = Promise<{ pillar?: string; type?: string }>;

/**
 * A filtered shelf is a real page, so it gets its own title and description
 * rather than inheriting the unfiltered one.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Search;
}): Promise<Metadata> {
  const { pillar } = await searchParams;

  if (pillar && validPillars.includes(pillar)) {
    const p = pillarById(pillar as PillarId);
    return {
      title: `${p.name} — ${p.subject}`,
      description: p.description,
    };
  }

  return {
    title: 'Explore',
    description:
      'The Life.Human archive — films, essays, visual stories and shorts, arranged by pillar and by form. A library, not a feed.',
  };
}

export default async function ExplorePage({ searchParams }: { searchParams: Search }) {
  const { pillar, type } = await searchParams;

  /* Anything unrecognised is simply ignored rather than shown as an error —
     a mistyped address should still land you in the library. */
  const activePillar =
    pillar && validPillars.includes(pillar) ? (pillar as PillarId) : undefined;
  const activeType = type && validTypes.includes(type) ? (type as PieceType) : undefined;

  const pillarInfo = activePillar ? pillarById(activePillar) : undefined;

  return (
    <>
      <PageHeader
        eyebrow={pillarInfo ? pillarInfo.subject : 'The archive'}
        title={
          pillarInfo ? pillarInfo.name : 'A growing archive of human questions.'
        }
        lede={
          pillarInfo
            ? pillarInfo.description
            : 'Everything here begins with a question rather than an answer. Browse by the direction it is asked from, or by the form it takes.'
        }
      />

      <div className={`shell ${styles.body}`} data-pillar={activePillar}>
        <ArchiveBrowser pieces={allPieces()} pillar={activePillar} type={activeType} />
      </div>
    </>
  );
}
