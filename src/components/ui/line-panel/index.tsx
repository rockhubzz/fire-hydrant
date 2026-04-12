import styles from '@/styles/Dashboard.module.css';

interface LinePanelProps {
  title: string;
  subtitle: string;
  path: string;
}

function toId(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export default function LinePanel({ title, subtitle, path }: LinePanelProps) {
  const id = toId(title);

  return (
    <article className={styles.chartCard}>
      <div className={styles.chartHead}>
        <p className={styles.chartTitle}>{title}</p>
        <span className={styles.chartTag}>Live</span>
      </div>
      <p className={styles.chartSubtitle}>{subtitle}</p>

      <svg viewBox="0 0 480 140" className={styles.chartSvg} aria-label={title}>
        <defs>
          <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(190, 25, 25, 0.32)" />
            <stop offset="100%" stopColor="rgba(190, 25, 25, 0.02)" />
          </linearGradient>
        </defs>
        <line x1="0" y1="24" x2="480" y2="24" className={styles.gridLine} />
        <line x1="0" y1="56" x2="480" y2="56" className={styles.gridLine} />
        <line x1="0" y1="88" x2="480" y2="88" className={styles.gridLine} />
        <line x1="0" y1="120" x2="480" y2="120" className={styles.gridLine} />
        <path d={`${path} L480 140 L0 140 Z`} fill={`url(#fill-${id})`} />
        <path d={path} className={styles.chartLine} />
      </svg>

      <p className={styles.chartTime}>Time</p>
    </article>
  );
}
