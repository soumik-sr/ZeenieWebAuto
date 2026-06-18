import React, { useState, useEffect } from 'react';
import './Header.css';
import { ShoppingBag, Menu, X } from 'lucide-react';

function Header({ currentPage, setCurrentPage, cartCount, setIsCartOpen }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Monitor scroll position to apply glassmorphic styles
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Announcement Banner */}
      <div className="announcement-banner">
        <span>COMPLIMENTARY WHITE-GLOVE AIR DELIVERY FOR ALL PRIVATE ALLOCATIONS OVER $250</span>
      </div>

      {/* Header Container */}
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          {/* Mobile Menu Toggle Button */}
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          <div className="logo-wrapper" onClick={() => handleNavClick('home')}>
            <span className="logo-sub">ATELIER</span>
            <span className="logo-main">AÉTHER</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <button 
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              Home
            </button>
            <button 
              className={`nav-link ${currentPage === 'collection' ? 'active' : ''}`}
              onClick={() => handleNavClick('collection')}
            >
              The Collection
            </button>
            <button 
              className={`nav-link ${currentPage === 'purity' ? 'active' : ''}`}
              onClick={() => handleNavClick('purity')}
            >
              Science of Purity
            </button>
            <button 
              className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}
              onClick={() => handleNavClick('contact')}
            >
              Private Allocation
            </button>
          </nav>

          {/* Action Icons */}
          <div className="header-actions">
            <button 
              className="cart-trigger" 
              onClick={() => setIsCartOpen(true)}
              aria-label="Open allocation bag"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* --- MOBILE DRAWER NAVIGATION --- */}
      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
        <div className="mobile-nav-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-drawer-header">
            <div className="logo-wrapper">
              <span className="logo-sub">ATELIER</span>
              <span className="logo-main">AÉTHER</span>
            </div>
            <button className="close-mobile-menu" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="mobile-nav-links">
            <button 
              className={`mobile-nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              Home
            </button>
            <button 
              className={`mobile-nav-link ${currentPage === 'collection' ? 'active' : ''}`}
              onClick={() => handleNavClick('collection')}
            >
              The Collection
            </button>
            <button 
              className={`mobile-nav-link ${currentPage === 'purity' ? 'active' : ''}`}
              onClick={() => handleNavClick('purity')}
            >
              Science of Purity
            </button>
            <button 
              className={`mobile-nav-link ${currentPage === 'contact' ? 'active' : ''}`}
              onClick={() => handleNavClick('contact')}
            >
              Private Allocation
            </button>
          </nav>

          <div className="mobile-drawer-footer">
            <p>AÉTHER CLIENT SERVICES</p>
            <p className="phone">+1 (800) 901-AETH</p>
            <p className="email">concierge@aetherwater.com</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;