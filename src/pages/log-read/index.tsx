import Head from 'next/head';
import { useEffect, useState } from 'react';
import DashboardFrame from '@/components/layout/dashboard-frame';
import StatusPill from '@/components/ui/status-pill';
import styles from '@/styles/Dashboard.module.css';
import { SensorLogEntry } from '@/types/system';

export default function LogReadPage() {
  const [logs, setLogs] = useState<SensorLogEntry[]>([]);

  const loadLogs = async () => {
    const response = await fetch('/api/logs?limit=30');
    const payload = await response.json();
    if (payload.ok) setLogs(payload.data as SensorLogEntry[]);
  };

  useEffect(() => {
    loadLogs();
    const timer = setInterval(loadLogs, 10_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Log Read - Hydrant Monitor</title>
      </Head>

      <DashboardFrame title="LOG READ" active="logs">
        <section className={styles.panelCard}>
          <div className={styles.panelHeaderRow}>
            <div>
              <h2>Hadoop Sensor Log</h2>
              <p>Data sensor dikirim otomatis setiap 1 menit dan dibaca ulang ke dashboard.</p>
            </div>
            <button onClick={loadLogs} className={`${styles.button} ${styles.ghost}`}>
              Refresh Log
            </button>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Api (%)</th>
                  <th>Suhu (C)</th>
                  <th>Tekanan</th>
                  <th>Flow</th>
                  <th>Valve</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={7}>Belum ada log.</td>
                  </tr>
                )}
                {logs.map((item) => (
                  <tr key={`${item.timestamp}-${item.firePercent}`}>
                    <td>{new Date(item.timestamp).toLocaleString('id-ID')}</td>
                    <td>{item.firePercent.toFixed(1)}</td>
                    <td>{item.temperatureC.toFixed(1)}</td>
                    <td>{item.pressureBar.toFixed(2)}</td>
                    <td>{item.flowRateLpm.toFixed(0)} L/min</td>
                    <td>{item.valveOpen ? 'Open' : 'Closed'}</td>
                    <td>
                      <StatusPill level={item.alertLevel} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </DashboardFrame>
    </>
  );
}
