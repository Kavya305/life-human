import type { Block } from '@/content/types';
import { Claim } from '@/components/piece/Claim';
import styles from './Prose.module.css';

/**
 * Renders the structured essay body. Content stays as data — never HTML
 * strings — so it can move to a CMS, be validated, or be re-rendered in
 * another medium without rewriting anything.
 */
export function Prose({ blocks, className }: { blocks: Block[]; className?: string }) {
  return (
    <div className={['prose', className].filter(Boolean).join(' ')}>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case 'h':
            return <h2 key={i}>{block.text}</h2>;

          case 'quote':
            return (
              <blockquote key={i}>
                {block.text}
                {block.attribution ? <cite>{block.attribution}</cite> : null}
              </blockquote>
            );

          case 'claim':
            return (
              <Claim key={i} kind={block.claim}>
                {block.text}
              </Claim>
            );

          /* A plain <img> rather than next/image: imported pieces point at
             remote hosts whose dimensions we do not know, and running those
             through the optimiser would mean whitelisting every domain a
             writer might ever paste from. */
          case 'image':
            return (
              <figure key={i} className={styles.figure}>
                <img src={block.src} alt={block.alt ?? ''} loading="lazy" decoding="async" />
                {block.caption && <figcaption>{block.caption}</figcaption>}
              </figure>
            );

          /* An aside is the editor stepping out from behind the essay to say
             something about the essay. It reads quieter than the body. */
          case 'aside':
            return (
              <aside key={i} className={styles.note}>
                {block.text}
              </aside>
            );

          default:
            return <p key={i}>{block.text}</p>;
        }
      })}
    </div>
  );
}
