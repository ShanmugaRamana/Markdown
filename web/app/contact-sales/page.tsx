'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { Check } from '@/app/components/Check';
import { Clock8 } from '@/app/components/Clock8'; // 1. Import Clock8

export default function ContactSales() {
  const navItems = [
    { title: 'Schedule consultation', subtitle: 'Schedule a call with a Markdown sales representative.' },
    { title: 'Student resources', subtitle: 'Find helpful guides and documentation.', content: 'Placeholder for links to guides, docs, and examples.' },
    { title: 'Technical support', subtitle: 'Get help with technical issues.', content: 'Placeholder for a support ticket form or contact info.' },
  ];

  const [activeSectionTitle, setActiveSectionTitle] = useState(navItems[0].title);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', institution: '', jobRole: '', address: '', state: '', country: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showSuccessView, setShowSuccessView] = useState(false);
  const [showPendingView, setShowPendingView] = useState(false); // **NEW state for pending**

  const activeSection = navItems.find(item => item.title === activeSectionTitle) || navItems[0];

  const resetViews = () => {
     setShowSuccessView(false);
     setShowPendingView(false);
     setSubmitStatus(null);
     setSubmitMessage('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    resetViews(); // Reset views before submitting

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.status === 409) { // **Check for Conflict status**
         setSubmitStatus('pending');
         setShowPendingView(true); // **Show pending view**
      } else if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      } else { // Status 201 Created
        setSubmitStatus('success');
        setShowSuccessView(true);
        // Optionally reset form
        setFormData({ firstName: '', lastName: '', email: '', phone: '', institution: '', jobRole: '', address: '', state: '', country: '' });
      }

    } catch (error) {
      console.error('Submission Error:', error);
      setSubmitStatus('error');
      setSubmitMessage((error as Error).message || 'Failed to submit your request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.contactLayout}>
        <aside className={styles.sidebar}>
          <nav>
            {navItems.map((item) => (
              <a href="#" key={item.title} onClick={(e) => { e.preventDefault(); setActiveSectionTitle(item.title); resetViews(); }} className={`${styles.navLink} ${item.title === activeSection.title ? styles.active : ''}`}>
                {item.title}
              </a>
            ))}
          </nav>
        </aside>

        <section className={styles.content}>
          <h1 className={styles.title}>{activeSection.title}</h1>
          <p className={styles.subtitle}>{activeSection.subtitle}</p>

          {activeSection.title === 'Schedule consultation' ? (
            showSuccessView ? (
              <div className={styles.successView}>
                <Check width={60} height={60} strokeWidth={2.5} />
                <h2>We received your request</h2>
                <p>We will contact you soon via phone or email.</p>
              </div>
            ) : showPendingView ? ( // **Render pending view if true**
              <div className={styles.pendingView}>
                <Clock8 width={60} height={60} strokeWidth={2} />
                <h2>We already got your request</h2>
                <p>Please kindly wait until we contact you soon.</p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                 {/* Form inputs... */}
                 <div className={styles.formRow}>
                   <div className={styles.formGroup}>
                     <label htmlFor="firstName">First name</label>
                     <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                   </div>
                   <div className={styles.formGroup}>
                     <label htmlFor="lastName">Last name</label>
                     <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                   </div>
                 </div>
                 <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="email">Email</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="phone">Phone number</label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                    </div>
                 </div>
                 <div className={styles.formGroup}>
                    <label htmlFor="institution">Institution</label>
                    <input type="text" id="institution" name="institution" value={formData.institution} onChange={handleInputChange} />
                 </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="jobRole">Job Role</label>
                    <input type="text" id="jobRole" name="jobRole" value={formData.jobRole} onChange={handleInputChange} />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} />
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="state">State</label>
                      <input type="text" id="state" name="state" value={formData.state} onChange={handleInputChange} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="country">Country</label>
                      <input type="text" id="country" name="country" value={formData.country} onChange={handleInputChange} />
                    </div>
                  </div>
                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
                {submitStatus === 'error' && submitMessage && (
                  <p className={styles.errorMessage}>{submitMessage}</p>
                )}
              </form>
            )
          ) : (
            <div className={styles.formPlaceholder}>
              <p>{activeSection.content}</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}