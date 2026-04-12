import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Landing.module.css';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Hydrant Guard - Home</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.page}>
        <section className={styles.shell}>
          <header className={styles.topNav}>
            <div className={styles.brandWrap}>
              <div className={styles.brandMark}>H</div>
              <div>
                <p className={styles.brandTitle}>Hydrant Guard</p>
                <p className={styles.brandSub}>Smart Fire Monitoring</p>
              </div>
            </div>

            <nav className={styles.navLinks}>
              <a href="#features">Features</a>
              <a href="#modules">Modules</a>
              <a href="#about">About</a>
            </nav>

            <div className={styles.navActions}>
              <Link href="/dashboard" className={styles.signIn}>
                Sign In
              </Link>
              <Link href="/dashboard" className={styles.signUp}>
                Open Dashboard
              </Link>
            </div>
          </header>

          <section className={styles.hero}>
            <div className={styles.heroLeft}>
              <p className={styles.kicker}>Emergency-Ready Platform</p>
              <h1>
                Sistem Monitoring Hydrant
                <br />
                untuk Respons Cepat
              </h1>
              <p>
                Pantau sensor secara real-time, jalankan auto-control valve, terima notifikasi Telegram,
                dan baca log Hadoop dalam satu command center.
              </p>
              <div className={styles.ctaRow}>
                <Link href="/dashboard" className={styles.primaryBtn}>
                  Masuk Dashboard
                </Link>
                <Link href="/log-read" className={styles.ghostBtn}>
                  Lihat Log
                </Link>
              </div>
            </div>

            <div className={styles.heroCard}>
              <p className={styles.heroCardTitle}>Live Snapshot</p>
              <div className={styles.heroMetrics}>
                <article>
                  <span>Fire Sensor</span>
                  <strong>Realtime</strong>
                </article>
                <article>
                  <span>Valve Control</span>
                  <strong>Auto + Manual</strong>
                </article>
                <article>
                  <span>Notification</span>
                  <strong>Telegram Alert</strong>
                </article>
              </div>
            </div>
          </section>

          <section id="features" className={styles.featureGrid}>
            <article className={styles.featureCard}>
              <h3>Real-time Monitoring</h3>
              <p>Data sensor api, suhu, tekanan, dan flow ditampilkan terus menerus.</p>
            </article>
            <article className={styles.featureCard}>
              <h3>Automatic Protection</h3>
              <p>Valve terbuka otomatis saat indikator kebakaran melewati ambang batas.</p>
            </article>
            <article className={styles.featureCard}>
              <h3>Audit and Logs</h3>
              <p>Semua data dicatat periodik ke Hadoop untuk evaluasi dan investigasi.</p>
            </article>
          </section>

          <section id="modules" className={styles.moduleStrip}>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/auto-control">Kontrol Otomatis</Link>
            <Link href="/manual-control">Kontrol Manual</Link>
            <Link href="/notifications">Notifikasi</Link>
            <Link href="/log-read">Log Read</Link>
          </section>
        </section>
      </main>
    </>
  );
}
