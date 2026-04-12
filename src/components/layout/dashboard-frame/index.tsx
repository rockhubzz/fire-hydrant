import Link from 'next/link';
import { ReactNode } from 'react';
import styles from '@/styles/Dashboard.module.css';

interface DashboardFrameProps {
  title: string;
  active: 'dashboard' | 'auto' | 'manual' | 'notif' | 'logs';
  children: ReactNode;
}

const menus = [
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { key: 'auto', label: 'Kontrol Otomatis', href: '/auto-control' },
  { key: 'manual', label: 'Kontrol Manual', href: '/manual-control' },
  { key: 'notif', label: 'Notifikasi', href: '/notifications' },
  { key: 'logs', label: 'Log Read', href: '/log-read' },
] as const;

export default function DashboardFrame({ title, active, children }: DashboardFrameProps) {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <div className={styles.logoWrap}>
            <div className={styles.logoBadge}>H</div>
            <div>
              <p className={styles.logoText}>Hydrant Guard</p>
              <p className={styles.logoSub}>Fire Safety Grid</p>
            </div>
          </div>

          <nav className={styles.menu}>
            {menus.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={item.key === active ? `${styles.menuLink} ${styles.menuLinkActive}` : styles.menuLink}
              >
                <span className={styles.menuDot} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.sidebarFooter}>
            <p>System Health</p>
            <strong>Online</strong>
          </div>
        </aside>

        <section className={styles.workspace}>
          <header className={styles.topbar}>
            <div>
              <h1>{active === 'dashboard' ? 'Dashboard Overview' : title}</h1>
              <p className={styles.topbarSub}>Real-time hydrant monitoring and control center</p>
            </div>

            <div className={styles.userBadge}>
              <span className={styles.bell} aria-hidden>
                !
              </span>
              <div className={styles.avatar} />
              <div>
                <p className={styles.userName}>Admin1</p>
                <p className={styles.userMail}>admin1@gmail.com</p>
              </div>
            </div>
          </header>

          {children}
        </section>
      </div>
    </main>
  );
}
