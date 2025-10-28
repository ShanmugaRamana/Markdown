import Link from 'next/link';
import styles from './Header.module.css';

// REMOVED: interface HeaderProps { onMenuClick: () => void; }

// REMOVED: ({ onMenuClick }: HeaderProps) from function signature
export default function Header() {
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Why Markdown', path: '#' },
    { name: 'Resources', path: '#' },
    { name: 'About Us', path: '#' },
    { name: 'Blog', path: '#' },
  ];

  return (
    <header className={styles.floatingHeader}>
      <nav className={styles.headerNav}>
        <div className={styles.navLogo}>
          <Link href="/">
             <strong>Markdown</strong>
          </Link>
        </div>
        <div className={styles.navLinks}>
          {navItems.map((item) => (
            <Link href={item.path} key={item.name} className={styles.navLinkAnchor}>
                {item.name}
            </Link>
          ))}
        </div>
        <div className={styles.navButtons}>
          <button className={`${styles.btn} ${styles.btnLogin}`}>Login</button>
          <Link href="/contact-sales" className={`${styles.btn} ${styles.btnContact}`}>
            Contact Sales <span className={styles.arrow}>&#8599;</span>
          </Link>
          {/* REMOVED: The menu button that used onMenuClick */}
          {/* <button onClick={onMenuClick} className={styles.menuButton}> ... </button> */}
        </div>
      </nav>
    </header>
  );
}