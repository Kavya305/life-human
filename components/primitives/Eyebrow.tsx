import styles from './Eyebrow.module.css';

/**
 * The small capital label used above sections. A hairline precedes it, which
 * is the one piece of ornament the system allows itself.
 */
export function Eyebrow({
  children,
  rule = true,
  as: Tag = 'p',
}: {
  children: React.ReactNode;
  rule?: boolean;
  as?: 'p' | 'h2' | 'span' | 'div';
}) {
  return (
    <Tag className={['eyebrow', styles.eyebrow].join(' ')} data-rule={rule}>
      {children}
    </Tag>
  );
}
