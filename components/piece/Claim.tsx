import type { ClaimKind } from '@/content/types';
import styles from './Claim.module.css';

/**
 * The epistemic marker.
 *
 * Assertion and speculation look identical on a page unless someone marks the
 * difference. On the subjects Life.Human works on — history, religion,
 * education, social criticism — that blurring is where most of the damage
 * happens. So the register of a claim is part of the content model, and it is
 * rendered, visibly, next to the claim itself.
 *
 * It is also real markup: <aside role="note"> with a labelled heading, so a
 * screen reader hears "Interpretation" before it hears the sentence.
 */

const labels: Record<ClaimKind, string> = {
  fact: 'Fact',
  interpretation: 'Interpretation',
  hypothesis: 'Hypothesis',
  question: 'Open question',
};

export function Claim({ kind, children }: { kind: ClaimKind; children: React.ReactNode }) {
  return (
    <aside className={styles.claim} data-kind={kind} role="note" aria-label={labels[kind]}>
      <span className={styles.label} aria-hidden="true">
        <span className={styles.dot} />
        {labels[kind]}
      </span>
      <p className={styles.body}>{children}</p>
    </aside>
  );
}

export { labels as claimLabels };
