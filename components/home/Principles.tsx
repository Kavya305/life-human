import { principles } from '@/content/principles';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Reveal } from '@/components/primitives/Reveal';
import styles from './Principles.module.css';

/**
 * The six commitments, set almost as a poem on the documentary ground.
 *
 * This is the one moment on the homepage that goes dark. It earns it: it is
 * the page saying what it will not do, which is the only claim here that costs
 * anything.
 */
export function Principles() {
  return (
    <section
      className={`section ${styles.principles}`}
      data-world="history"
      data-paint=""
      aria-labelledby="principles-h"
    >
      <div className="shell">
        <Reveal>
          <Eyebrow>How we work</Eyebrow>
          <h2 id="principles-h" className={styles.title}>
            Editorial principles
          </h2>
        </Reveal>

        <ul className={styles.list}>
          {principles.map((p, i) => (
            <Reveal as="li" key={p.left} delay={i * 80}>
              <span className={styles.left}>{p.left}</span>
              <span className={styles.over}>over</span>
              <span className={styles.right}>{p.right}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
