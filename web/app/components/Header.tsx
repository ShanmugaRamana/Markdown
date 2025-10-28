import Link from 'next/link'; // Make sure Link is imported
import styles from './Header.module.css';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  // Define links with their paths
  const navItems = [
    { name: 'Home', path: '/' }, // Set path for Home
    { name: 'Why Markdown', path: '#' }, // Keep others as placeholders for now
    { name: 'Resources', path: '#' },
    { name: 'About Us', path: '#' },
    { name: 'Blog', path: '#' },
  ];

  return (
    <header className={styles.floatingHeader}>
      <nav className={styles.headerNav}>
        <div className={styles.navLogo}>
          {/* Optional: Make logo link home too */}
          <Link href="/">
             <strong>Markdown</strong>
          </Link>
        </div>
        <div className={styles.navLinks}>
          {navItems.map((item) => (
            // Use Link component for internal navigation
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
          <button onClick={onMenuClick} className={styles.menuButton}>
            <div className={styles.menuIconBar} />
            <div className={styles.menuIconBar} />
            <div className={styles.menuIconBar} />
          </button>
        </div>
      </nav>
    </header>
  );
}