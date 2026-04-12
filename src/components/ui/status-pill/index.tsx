import { AlertLevel } from '@/types/system';
import styles from '@/styles/Dashboard.module.css';

interface StatusPillProps {
  level?: AlertLevel;
}

export default function StatusPill({ level = 'NORMAL' }: StatusPillProps) {
  const label =
    level === 'KEBAKARAN' ? 'Critical' : level === 'POTENSI_KEBAKARAN' ? 'Warning' : 'Safe';

  const className =
    level === 'KEBAKARAN'
      ? `${styles.pill} ${styles.pillDanger}`
      : level === 'POTENSI_KEBAKARAN'
        ? `${styles.pill} ${styles.pillWarn}`
        : `${styles.pill} ${styles.pillSafe}`;

  return <span className={className}>{label}</span>;
}
