import React from 'react';
import './Home.css';
import { Compass, ShieldCheck, Award, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';

function Home({ setCurrentPage, addToCart }) {
  // 3 Featured products to display on home
  const featuredEditions = [
    {
      id: 'still-750',
      name: 'AÉTHER Still',
      price: 18.00,
      volume: '750ml • Glass Decanter',
      description: 'Sourced from protected alpine aquifers, naturally filtered through volcanic basalt. Incredibly light, smooth, and refreshing.',
      image: 'https://images.unsplash.com/photo-1608885898957-a599fb18ec3f?auto=format&fit=crop&w=800&q=80', // Glass bottle water
    },
    {
      id: 'sparkling-750',
      name: 'AÉTHER Sparkling',
      price: 20.00,
      volume: '750ml • Glass Decanter',
      description: 'The same pristine alpine water, carbonated with ultra-fine micro-bubbles for a soft, velvety effervescence on the palate.',
      image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?auto=format&fit=crop&w=800&q=80', // Sparkling water glass
    },
    {
      id: 'volcanic-750',
      name: 'The Volcanic Reserve',
      price: 45.00,
      volume: '750ml • Black Frosted Decanter',
      description: 'A limited-run high-silica water sourced from deep subterranean magma chambers. Promotes cellular regeneration and wellness.',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80', // Luxury dark glass decanter
    }
  ];

  return (
    <div className="home-wrapper">
      {/* --- HERO SECTION --- */}
      <section className="hero-section">
        <div className="hero-background-overlay"></div>
        <div className="container hero-content animate-fade-in">
          <span className="hero-pre-title">THE EPITOME OF PURITY</span>
          <h1 className="hero-title">
            Pure Earth. <br />
            Refined by Time. <br />
            <span className="italic-gold">Bottled in Glass.</span>
          </h1>
          <p className="hero-subtitle">
            AÉTHER is alpine glacial spring water, naturally filtered through prehistoric basalt chambers over 150 years. Crafted for the discerning palate.
          </p>
          <div className="hero-actions">
            <button className="btn-luxury" onClick={() => setCurrentPage('collection')}>
              Explore Collection
            </button>
            <button className="btn-luxury-outline hero-outline-btn" onClick={() => setCurrentPage('purity')}>
              The Science
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator" onClick={() => {
          const nextSec = document.querySelector('.philosophy-section');
          nextSec?.scrollIntoView({ behavior: 'smooth' });
        }}>
          <span>Scroll to Discover</span>
          <ChevronDown size={14} className="chevron-bounce" />
        </div>
      </section>

      {/* --- PHILOSOPHY SECTION --- */}
      <section className="philosophy-section section-padding">
        <div className="container philosophy-grid">
          {/* Text Side */}
          <div className="philosophy-text">
            <span className="section-badge">OUR ORIGIN</span>
            <h2 className="section-title">A Journey of 150 Years</h2>
            <p className="philosophy-para">
              High in the pristine French Alps, a single drop of snow falls onto glacial ice. For over a century and a half, that drop slowly percolates down through miles of mineral-rich basalt rock, igneous granite, and quartz sands.
            </p>
            <p className="philosophy-para">
              As it travels, it is naturally filtered to absolute purity and infused with a unique composition of life-enhancing minerals: Silica, Magnesium, and Calcium. By the time it reaches our deep subterranean spring, it is mathematically perfect.
            </p>
            
            {/* Stats Block */}
            <div className="philosophy-stats">
              <div className="stat-card">
                <span className="stat-num">7.8</span>
                <span className="stat-label">pH Balanced</span>
              </div>
              <div className="stat-card">
                <span className="stat-num">150+</span>
                <span className="stat-label">Years Filtered</span>
              </div>
              <div className="stat-card">
                <span className="stat-num">100%</span>
                <span className="stat-label">Recycled Crystal</span>
              </div>
            </div>
          </div>

          {/* Visual Side with offset border */}
          <div className="philosophy-visual">
            <div className="gold-offset-border"></div>
            <div className="visual-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1548263544-24d222c17a5f?auto=format&fit=crop&w=1000&q=80" 
                alt="Pristine mountain stream in the Alps" 
                className="philosophy-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURED EDITIONS --- */}
      <section className="featured-section section-padding">
        <div className="container">
          <div className="featured-header">
            <div>
              <span className="section-badge">THE CELLAR</span>
              <h2 className="section-title">The Signature Editions</h2>
            </div>
            <button className="btn-luxury-outline" onClick={() => setCurrentPage('collection')}>
              View All Editions <ArrowRight size={14} style={{ marginLeft: '0.5rem' }} />
            </button>
          </div>

          <div className="featured-grid">
            {featuredEditions.map((edition) => (
              <div className="featured-card" key={edition.id}>
                <div className="card-image-wrapper">
                  <img src={edition.image} alt={edition.name} className="card-img" />
                  <div className="card-overlay-actions">
                    <button className="btn-luxury-outline select-btn" onClick={() => addToCart(edition)}>
                      Allocate Decanter
                    </button>
                  </div>
                </div>
                <div className="card-info">
                  <div className="card-meta-row">
                    <span className="card-volume">{edition.volume}</span>
                    <span className="card-price">${edition.price.toFixed(2)}</span>
                  </div>
                  <h3 className="card-title">{edition.name}</h3>
                  <p className="card-desc">{edition.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- THE PILLARS (STANDARDS) --- */}
      <section className="pillars-section">
        <div className="container pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon-wrapper">
              <Compass strokeWidth={1} size={32} />
            </div>
            <h3>Glacial Source</h3>
            <p>Sourced from a single, highly protected aquifer nested 2,500 meters deep below alpine rock, untouched by modern pollutants.</p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon-wrapper">
              <ShieldCheck strokeWidth={1} size={32} />
            </div>
            <h3>Clinical Purity</h3>
            <p>Bottled at the source under strict cleanroom environments, preserving its delicate mineral balance and refreshing 7.8 pH.</p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon-wrapper">
              <Award strokeWidth={1} size={32} />
            </div>
            <h3>Eco-Circularity</h3>
            <p>Our hand-blown glass decanters are 100% recyclable, and our operations are certified carbon-neutral from spring to estate.</p>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIAL QUOTE --- */}
      <section className="testimonial-section section-padding">
        <div className="container testimonial-container">
          <span className="quote-mark">“</span>
          <blockquote>
            AÉTHER is not merely water; it is a gastronomic revelation. The mineral profile—specifically the natural silica content—gives it an incredibly silky mouthfeel that elevates rare vintages and premium caviar alike.
          </blockquote>
          <cite>Chef Jean-Luc Moreau, Michelin-Starred Sommelier</cite>
          <div className="gold-divider"></div>
        </div>
      </section>
    </div>
  );
}

export default Home;