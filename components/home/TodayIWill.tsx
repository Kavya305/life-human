'use client';

import { useState } from 'react';
import { todayIWill } from '@/content/today';
import { ShareToday } from './ShareToday';
import styles from './TodayIWill.module.css';

/**
 * Today I Will.
 *
 * The whole design problem here is restraint. The obvious build — a streak, a
 * "mark as done", a counter, a share button — would turn a small human thing
 * into a habit tracker, and the project would quietly become the sort of
 * product it exists to question.
 *
 * So: one line, one way to see another, and an explicit permission to ignore
 * it. Nothing is stored, nothing is counted, nothing is completed.
 *
 * The starting line comes from the date rather than from Math.random(), so the
 * server and the client agree — and so that a given day genuinely has *a*
 * line rather than a shuffle.
 */

const dayIndex = () => {
  const days = Math.floor(Date.now() / 86_400_000);
  return days % todayIWill.length;
};

export function TodayIWill({
  heading = 'h2',
  share = false,
}: {
  heading?: 'h2' | 'h1';
  /* Only the Today page offers this. The homepage band stays a place to
     read one line, not a place to be asked to broadcast it. */
  share?: boolean;
}) {
  const [index, setIndex] = useState(dayIndex);
  /* Keyed on the index so the line re-enters rather than snapping. */
  const line = todayIWill[index];
  const Heading = heading;

  return (
    <section className={`section ${styles.today}`} data-world="wisdom" data-paint="" aria-labelledby="today-h">
      <div className="shell-narrow">
        <Heading id="today-h" className={styles.lead}>
          <span className={styles.prefix}>Today I will</span>
          <span key={index} className={styles.line}>
            {line}
          </span>
        </Heading>

        <div className={styles.foot}>
          <button
            type="button"
            className={styles.another}
            onClick={() => setIndex((i) => (i + 1) % todayIWill.length)}
          >
            Another
          </button>
          <span className={styles.permission}>Take it or leave it.</span>
        </div>

        {share && <ShareToday line={line} />}
      </div>
    </section>
  );
}
