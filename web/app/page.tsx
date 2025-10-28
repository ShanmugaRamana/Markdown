import styles from './page.module.css';
import Link from 'next/link'; // Still needed for the hero button

export default function Home() {
  // The 'navItems' array and <header> are no longer here
  
  return (
    <main className={styles.main}>
      {/* The Header component is now in layout.tsx */}

      {/* --- 3-Column Hero Container --- */}
      <section className={styles.heroContainer}>
        
        {/* --- Column 1: Left Popups --- */}
        <div className={styles.popupColumn}>
          <div className={`${styles.popup} ${styles.featurePopup}`}>
            <span></span>
            <div>
              <strong>Real-time Collaboration</strong>
              <p>Sync your work instantly.</p>
            </div>
          </div>
          <div className={`${styles.popup} ${styles.templatesPopup}`}>
            <span></span>
            <div>
              <strong>Built-in Templates</strong>
              <p>Start with a preset.</p>
            </div>
          </div>
        </div>

        {/* --- Column 2: Center Hero Content --- */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroLine1}>Markdown</h1>
          <p className={styles.heroLine2}>
            Where precision meets<br />perfection in every document.
          </p>
          <p className={styles.heroLine3}>
            Experience a seamless and collaborative LaTeX environment built for
            students who value clarity, control, and creativity.
          </p>
          <div className={styles.heroButtons}>
            {/* The 'styles.btn' class is removed, styles are now in btnHeroPrimary */}
            <button className={styles.btnHeroPrimary}>
              Learn More
            </button>
            {/* The 'styles.btn' class is removed, styles are now in btnHeroSecondary */}
            <Link href="/contact-sales" className={styles.btnHeroSecondary}>
              Contact Sales <span className={styles.arrow}>&#8599;</span>
            </Link>
          </div>
        </div>

        {/* --- Column 3: Right Popups --- */}
        <div className={styles.popupColumn}>
          <div className={`${styles.popup} ${styles.downloadsPopup}`}>
            <h3>50k+</h3>
            <p>Downloads</p>
          </div>
          <div className={`${styles.popup} ${styles.statsPopup}`}>
            <h3>10k+</h3>
            <p>Active Users</p>
          </div>
          <div className={`${styles.popup} ${styles.integrationsPopup}`}>
            <span></span>
            <p>Slack, Git & more</p>
          </div>
        </div>
      </section>
    </main>
  );
}