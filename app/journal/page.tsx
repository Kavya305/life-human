import type { Metadata } from 'next';
import { journalPieces } from '@/lib/content';
import { PageHeader } from '@/components/primitives/PageHeader';
import { PieceCard } from '@/components/archive/PieceCard';
import { Reveal } from '@/components/primitives/Reveal';
import styles from './journal.module.css';

export const metadata: Metadata = {
  title: 'Journal',
  description:
    'The written work of Life.Human — essays and visual stories on life, humanity, history, ancient wisdom and the systems that shape us.',
};

/** The written work, on its own, for people who would rather read. */
export default function JournalPage() {
  const written = journalPieces();

  return (
    <>
      <PageHeader
        eyebrow="Written work"
        title="Journal"
        lede="Essays and visual stories. Some accompany a film; some stand on their own. All of them are meant to be read slowly."
      />

      <div className="shell">
        <ul className={styles.list}>
          {written.map((piece, i) => (
            <Reveal as="li" key={piece.slug} delay={(i % 3) * 80}>
              <PieceCard piece={piece} />
            </Reveal>
          ))}
        </ul>
      </div>
    </>
  );
}
