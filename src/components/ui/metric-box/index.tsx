import { ReactNode } from 'react';
import styles from '@/styles/Dashboard.module.css';

interface MetricBoxProps {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
}

export default function MetricBox({ label, value, sub }: MetricBoxProps) {
  return (
    <article className={styles.metricBox}>
      <div className={styles.metricGlow} />
      <p className={styles.metricLabel}>{label}</p>
      <p className={styles.metricValue}>{value}</p>
      {sub ? <p className={styles.metricSub}>{sub}</p> : null}
    </article>
  );
}
