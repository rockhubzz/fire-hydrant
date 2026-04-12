import styles from '@/styles/Home.module.css';

interface NavbarLink {
  href: string;
  label: string;
}

interface NavbarProps {
  brand?: string;
  links?: NavbarLink[];
}

const defaultLinks: NavbarLink[] = [
  { href: '#dashboard', label: 'Dashboard' },
  { href: '#otomatis', label: 'Kontrol Otomatis' },
  { href: '#manual', label: 'Kontrol Manual' },
  { href: '#notif', label: 'Notifikasi' },
  { href: '#logging', label: 'Log Hadoop' },
];

export default function Navbar({ brand = 'HYDRANT REDWATCH', links = defaultLinks }: NavbarProps) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.brandWrap}>
        <div className={styles.brandDot} />
        <div className={styles.brand}>{brand}</div>
      </div>
      <div className={styles.links}>
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
