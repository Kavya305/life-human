import { Reveal } from '@/components/primitives/Reveal';
import styles from './Premise.module.css';

/**
 * The premise. Tuṣṭi and Puṣṭi, set as a definition pair, then the reason the
 * pair matters. This is the second thing anyone reads, so it is the only place
 * on the homepage that explains anything at length.
 */
export function Premise() {
  return (
    <section className={`section ${styles.premise}`} id="premise" aria-labelledby="premise-h">
      <div className="shell-narrow">
        <Reveal>
          <h2 className="visually-hidden" id="premise-h">
            The premise
          </h2>

          <dl className={styles.pair}>
            <div>
              <dt>Tuṣṭi</dt>
              <dd>contentment</dd>
            </div>
            <span className={styles.divider} aria-hidden="true" />
            <div>
              <dt>Puṣṭi</dt>
              <dd>nourishment</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={120}>
          <p className={styles.body}>
            They are a pair, and they need each other. Contentment without
            nourishment is stagnation dressed up as peace. Nourishment without
            contentment is appetite that never closes.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <p className={styles.body}>
            Almost everything competing for your attention runs on the opposite
            pair — dissatisfaction and depletion. This is an attempt at
            something else.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
