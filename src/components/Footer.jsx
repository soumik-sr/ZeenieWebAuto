import React, { useState } from 'react';
import './Footer.css';
import { Mail, ArrowRight, Instagram, Compass, ShieldCheck } from 'lucide-react';

function Footer({ setCurrentPage }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="container footer-grid">
          {/* Brand Column */}
          <div className="footer-col brand-col">
            <div className="logo-wrapper" onClick={() => setCurrentPage('home')}>
              <span className="logo-sub">ATELIER</span>
              <span className="logo-main">AÉTHER</span>
            </div>
            <p className="brand-pitch">
              AÉTHER is the world's most pristine high-mineral water, sourced from protected volcanic aquifers and bottled in hand-finished glass decanters. Engineered for the discerning palate.
            </p>
            <div className="social-icons">
              <a href="#instagram" className="social-link" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#journal" className="social-link" aria-label="Journal">
                <Compass size={18} />
              </a>
              <a href="#purity" className="social-link" aria-label="Purity Standard">
                <ShieldCheck size={18} />
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="footer-col links-col">
            <h3>THE ATELIER</h3>
            <ul>
              <li><button onClick={() => setCurrentPage('home')}>Home</button></li>
              <li><button onClick={() => setCurrentPage('collection')}>The Collection</button></li>
              <li><button onClick={() => setCurrentPage('purity')}>Science of Purity</button></li>
              <li><button onClick={() => setCurrentPage('contact')}>Private Allocation</button></li>
            </ul>
          </div>

          {/* Boutique Hours */}
          <div className="footer-col hours-col">
            <h3>BOUTIQUE HOURS</h3>
            <p><strong>ATELIER PARIS</strong><br />Place Vendôme, Paris<br />Mon – Sat: 10:00 – 19:00</p>
            <p style={{ marginTop: '1.2rem' }}><strong>ATELIER MONACO</strong><br />Avenue de Monte-Carlo, Monaco<br />Mon – Sat: 11:00 – 20:00</p>
          </div>

          {/* Newsletter Column */}
          <div className="footer-col newsletter-col">
            <h3>THE ALLOCATION JOURNAL</h3>
            <p className="newsletter-text">
              Subscribe to receive exclusive access to limited-run crystal decanters and private reserve allocations.
            </p>
            {subscribed ? (
              <div className="newsletter-success">
                <span className="success-dot"></span>
                <span>Thank you. You are now registered.</span>
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <input 
                  type="email" 
                  placeholder="ENTER YOUR EMAIL" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
                <button type="submit" aria-label="Subscribe">
                  <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p className="copyright">
            &copy; {new Date().getFullYear()} AÉTHER ATELIER. ALL RIGHTS RESERVED.
          </p>
          <div className="footer-legal-links">
            <a href="#terms">TERMS OF ALLOCATION</a>
            <span className="divider">|</span>
            <a href="#privacy">PRIVACY POLICY</a>
            <span className="divider">|</span>
            <a href="#carbon">CARBON FOOTPRINT REPORT</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;