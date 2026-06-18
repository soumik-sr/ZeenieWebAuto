import React, { useState } from 'react';
import './Collection.css';
import { Plus, Minus, HelpCircle, Sparkles, Check, Package, Layers } from 'lucide-react';

function Collection({ addToCart }) {
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Custom case builder state
  const [crateSize, setCrateSize] = useState(6); // 6 or 12 bottles
  const [chestFinish, setChestFinish] = useState('Smoked Oak'); // Smoked Oak, Raw Alabaster, Brushed Platinum
  const [composition, setComposition] = useState({
    still: 3,
    sparkling: 2,
    volcanic: 1
  });
  const [engravingText, setEngravingText] = useState('');
  const [crateSuccess, setCrateSuccess] = useState(false);

  // Full product catalog
  const products = [
    {
      id: 'still-750',
      name: 'AÉTHER Still',
      price: 18.00,
      category: 'Still',
      volume: '750ml • Glass Decanter',
      description: 'Pure, crisp alpine glacial spring water with an incredibly light and silky mouthfeel. Naturally balanced pH 7.8.',
      image: 'https://images.unsplash.com/photo-1608885898957-a599fb18ec3f?auto=format&fit=crop&w=800&q=80',
      specs: { pH: '7.8', TDS: '120 mg/L', Silica: '48 mg/L' }
    },
    {
      id: 'still-375',
      name: 'AÉTHER Still Demi',
      price: 12.00,
      category: 'Still',
      volume: '375ml • Glass Decanter',
      description: 'The same pristine still water, sized perfectly for individual dining services and private jet catering.',
      image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=80',
      specs: { pH: '7.8', TDS: '120 mg/L', Silica: '48 mg/L' }
    },
    {
      id: 'sparkling-750',
      name: 'AÉTHER Sparkling',
      price: 20.00,
      category: 'Sparkling',
      volume: '750ml • Glass Decanter',
      description: 'Our signature glacial water infused with ultra-fine, velvety carbonation. Designed to cleanse the palate between courses.',
      image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?auto=format&fit=crop&w=800&q=80',
      specs: { pH: '6.2 (Carbonated)', TDS: '120 mg/L', Silica: '48 mg/L' }
    },
    {
      id: 'sparkling-375',
      name: 'AÉTHER Sparkling Demi',
      price: 14.00,
      category: 'Sparkling',
      volume: '375ml • Glass Decanter',
      description: 'Our carbonated reserve, bottled in a compact 375ml crystal-glass vessel. Ideal for high-end boutique hospitality.',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
      specs: { pH: '6.2 (Carbonated)', TDS: '120 mg/L', Silica: '48 mg/L' }
    },
    {
      id: 'volcanic-750',
      name: 'The Volcanic Reserve',
      price: 45.00,
      category: 'Reserves',
      volume: '750ml • Black Frosted Decanter',
      description: 'A highly mineralized, high-silica water sourced from protected volcanic basalt chambers. Promotes wellness and cell hydration.',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
      specs: { pH: '8.1', TDS: '340 mg/L', Silica: '92 mg/L' }
    },
    {
      id: 'glacier-1l',
      name: 'The Glacier Decanter',
      price: 125.00,
      category: 'Reserves',
      volume: '1000ml • Hand-Blown Crystal',
      description: 'A numbered, limited-run crystal decanter filled with water harvested directly from deep interior glacial core ice.',
      image: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=800&q=80',
      specs: { pH: '7.9', TDS: '95 mg/L', Silica: '35 mg/L' }
    }
  ];

  // Filters catalog
  const filteredProducts = products.filter(product => {
    if (activeFilter === 'All') return true;
    return product.category === activeFilter;
  });

  // Calculate current composition total
  const getCompositionTotal = () => {
    return composition.still + composition.sparkling + composition.volcanic;
  };

  // Adjust bottle count for custom builder
  const handleBottleAdjust = (type, change) => {
    const currentTotal = getCompositionTotal();
    const currentVal = composition[type];
    
    // Prevent negative quantities
    if (currentVal + change < 0) return;
    
    // Prevent exceeding total crate size
    if (change > 0 && currentTotal >= crateSize) {
      // Automatically subtract from another type if we are trying to add and at limit
      // or just block. Let's block and let user manage.
      return;
    }
    
    setComposition(prev => ({
      ...prev,
      [type]: currentVal + change
    }));
  };

  // Handle crate size change (resets composition to maintain fit)
  const handleCrateSizeChange = (size) => {
    setCrateSize(size);
    if (size === 6) {
      setComposition({ still: 3, sparkling: 2, volcanic: 1 });
    } else {
      setComposition({ still: 6, sparkling: 4, volcanic: 2 });
    }
  };

  // Calculate Custom Crate Price
  const getCratePrice = () => {
    // Base chest packaging costs
    const chestCosts = {
      'Smoked Oak': 45.00,
      'Raw Alabaster': 60.00,
      'Brushed Platinum': 80.00
    };
    
    // Bottle unit costs in crate builder
    const bottlePrices = {
      still: 15.00,      // Discounted slightly in bulk crate
      sparkling: 17.00,
      volcanic: 40.00
    };

    const bottlesTotal = 
      (composition.still * bottlePrices.still) + 
      (composition.sparkling * bottlePrices.sparkling) + 
      (composition.volcanic * bottlePrices.volcanic);
      
    return bottlesTotal + chestCosts[chestFinish];
  };

  // Add Custom Crate to Cart
  const handleAddCrateToCart = () => {
    const totalBottles = getCompositionTotal();
    if (totalBottles !== crateSize) {
      alert(`Please fill your crate. Current bottle count: ${totalBottles}/${crateSize}`);
      return;
    }

    const customCrateItem = {
      id: `custom-crate-${crateSize}`,
      name: `${crateSize}-Bottle Custom Crate`,
      price: getCratePrice(),
      volume: `${chestFinish} Chest`,
      image: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=800&q=80', // elegant placeholder
      isCrate: true,
      crateDetails: {
        size: crateSize,
        finish: chestFinish,
        composition: { ...composition },
        engraving: engravingText
      },
      quantity: 1
    };

    addToCart(customCrateItem);
    
    // Show temporary success feedback
    setCrateSuccess(true);
    setTimeout(() => setCrateSuccess(false), 3000);
  };

  // Helper to render visual bottles in the chest
  const renderVisualBottles = () => {
    const bottles = [];
    
    // Populate bottles based on composition
    for (let i = 0; i < composition.still; i++) bottles.push('still');
    for (let i = 0; i < composition.sparkling; i++) bottles.push('sparkling');
    for (let i = 0; i < composition.volcanic; i++) bottles.push('volcanic');
    
    // Fill remaining slots with empty indicators if any
    const remaining = crateSize - bottles.length;
    for (let i = 0; i < remaining; i++) bottles.push('empty');

    return (
      <div className={`crate-grid-display size-${crateSize} finish-${chestFinish.toLowerCase().replace(' ', '-')}`}>
        {bottles.map((bottle, idx) => (
          <div className={`bottle-slot ${bottle}`} key={idx}>
            {bottle !== 'empty' ? (
              <div className="bottle-visual">
                <span className="liquid"></span>
                <span className="label-text">{bottle.toUpperCase()[0]}</span>
              </div>
            ) : (
              <div className="empty-slot">
                <span>+</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="collection-page-wrapper">
      {/* --- PAGE HEADER --- */}
      <section className="collection-hero">
        <div className="container text-center">
          <span className="section-badge">THE CELLAR</span>
          <h1 className="page-title">The Complete Collection</h1>
          <p className="page-subtitle">
            Explore our curated range of individual crystal-glass decanters, limited volcanic reserves, and bespoke hand-crafted wooden crates.
          </p>
        </div>
      </section>

      {/* --- FILTER NAVIGATION --- */}
      <section className="catalog-filters-section">
        <div className="container filter-nav-container">
          <div className="filter-buttons">
            {['All', 'Still', 'Sparkling', 'Reserves'].map((filter) => (
              <button
                key={filter}
                className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === 'Reserves' ? 'Limited Reserves' : filter}
              </button>
            ))}
          </div>
          <span className="results-count">{filteredProducts.length} Editions Available</span>
        </div>
      </section>

      {/* --- CATALOG GRID --- */}
      <section className="catalog-grid-section">
        <div className="container catalog-grid">
          {filteredProducts.map((product) => (
            <div className="catalog-card" key={product.id}>
              <div className="catalog-img-wrapper">
                <img src={product.image} alt={product.name} />
                <div className="catalog-card-overlay">
                  <button className="btn-luxury" onClick={() => addToCart(product)}>
                    Allocate Decanter
                  </button>
                </div>
              </div>
              <div className="catalog-info">
                <div className="catalog-meta">
                  <span>{product.volume}</span>
                  <span className="catalog-price">${product.price.toFixed(2)}</span>
                </div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                
                {/* Mineral Specs */}
                <div className="mineral-specs-row">
                  <div className="spec-item">
                    <span className="spec-label">pH</span>
                    <span className="spec-val">{product.specs.pH}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">TDS</span>
                    <span className="spec-val">{product.specs.TDS}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Silica</span>
                    <span className="spec-val">{product.specs.Silica}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- BESPOKE CASE BUILDER --- */}
      <section className="case-builder-section section-padding">
        <div className="container case-builder-grid">
          {/* Visual Display Side */}
          <div className="case-visual-panel">
            <div className="visual-header">
              <span className="visual-tag">LIVE VISUALIZER</span>
              <h3>Your Bespoke Chest</h3>
              <p>Selected Finish: <strong>{chestFinish}</strong> ({crateSize} Bottles)</p>
            </div>
            
            {/* Visual Crate Grid */}
            <div className="crate-outer-wrapper">
              {renderVisualBottles()}
            </div>
            
            <div className="visual-legend">
              <div className="legend-item"><span className="dot still"></span> Still (S)</div>
              <div className="legend-item"><span className="dot sparkling"></span> Sparkling (P)</div>
              <div className="legend-item"><span className="dot volcanic"></span> Volcanic (V)</div>
              <div className="legend-item"><span className="dot empty"></span> Empty</div>
            </div>
          </div>

          {/* Builder Controls Side */}
          <div className="case-controls-panel">
            <span className="section-badge">BOTANICAL COUTURE</span>
            <h2 className="section-title">The Bespoke Crate Builder</h2>
            <p className="controls-intro">
              Curate a customized wooden crate tailored for your estate, superyacht, or private collection. Select your chest scale, timber finish, and mix of signature decanters.
            </p>

            {/* Step 1: Select Size */}
            <div className="builder-step">
              <div className="step-label"><span>01</span> SELECT CRATE SCALE</div>
              <div className="size-selector-row">
                <button 
                  className={`size-btn ${crateSize === 6 ? 'active' : ''}`}
                  onClick={() => handleCrateSizeChange(6)}
                >
                  <Package size={18} />
                  <div>
                    <strong>6-BOTTLE CHEST</strong>
                    <span>Perfect for intimate gatherings</span>
                  </div>
                </button>
                <button 
                  className={`size-btn ${crateSize === 12 ? 'active' : ''}`}
                  onClick={() => handleCrateSizeChange(12)}
                >
                  <Layers size={18} />
                  <div>
                    <strong>12-BOTTLE CHEST</strong>
                    <span>Designed for private cellars</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Select Finish */}
            <div className="builder-step">
              <div className="step-label"><span>02</span> TIMBER & HARDWARE FINISH</div>
              <div className="finish-selector-row">
                {['Smoked Oak', 'Raw Alabaster', 'Brushed Platinum'].map((finish) => (
                  <button
                    key={finish}
                    className={`finish-btn ${chestFinish === finish ? 'active' : ''}`}
                    onClick={() => setChestFinish(finish)}
                  >
                    <span className={`finish-dot ${finish.toLowerCase().replace(' ', '-')}`}></span>
                    {finish}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Composition */}
            <div className="builder-step">
              <div className="step-label">
                <span>03</span> CURATE BOTTLE ALLOCATION
                <span className="bottle-counter-tag">
                  {getCompositionTotal()} / {crateSize} BOTTLES
                </span>
              </div>
              
              <div className="allocation-controls-list">
                {/* Still */}
                <div className="allocation-control-item">
                  <div className="item-meta">
                    <strong>AÉTHER Still</strong>
                    <span>$15.00 / bottle in crate</span>
                  </div>
                  <div className="builder-qty-controller">
                    <button onClick={() => handleBottleAdjust('still', -1)}><Minus size={14} /></button>
                    <span>{composition.still}</span>
                    <button onClick={() => handleBottleAdjust('still', 1)}><Plus size={14} /></button>
                  </div>
                </div>

                {/* Sparkling */}
                <div className="allocation-control-item">
                  <div className="item-meta">
                    <strong>AÉTHER Sparkling</strong>
                    <span>$17.00 / bottle in crate</span>
                  </div>
                  <div className="builder-qty-controller">
                    <button onClick={() => handleBottleAdjust('sparkling', -1)}><Minus size={14} /></button>
                    <span>{composition.sparkling}</span>
                    <button onClick={() => handleBottleAdjust('sparkling', 1)}><Plus size={14} /></button>
                  </div>
                </div>

                {/* Volcanic */}
                <div className="allocation-control-item">
                  <div className="item-meta">
                    <strong>The Volcanic Reserve</strong>
                    <span>$40.00 / bottle in crate</span>
                  </div>
                  <div className="builder-qty-controller">
                    <button onClick={() => handleBottleAdjust('volcanic', -1)}><Minus size={14} /></button>
                    <span>{composition.volcanic}</span>
                    <button onClick={() => handleBottleAdjust('volcanic', 1)}><Plus size={14} /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Engraving */}
            <div className="builder-step">
              <div className="step-label"><span>04</span> CUSTOM ENGRAVING (OPTIONAL)</div>
              <input 
                type="text" 
                className="engraving-input"
                placeholder="ENGRAVE BRASS PLATE (MAX 30 CHARACTERS)"
                maxLength={30}
                value={engravingText}
                onChange={(e) => setEngravingText(e.target.value.toUpperCase())}
              />
            </div>

            {/* Summary & ATC */}
            <div className="builder-summary-card">
              <div className="summary-row">
                <span>Crate Contents</span>
                <span>{getCompositionTotal()} / {crateSize} Bottles Selected</span>
              </div>
              <div className="summary-row">
                <span>Timber Finish</span>
                <span>{chestFinish} Case</span>
              </div>
              <div className="summary-row total">
                <span>Estimated Value</span>
                <span className="price">${getCratePrice().toFixed(2)}</span>
              </div>

              {crateSuccess ? (
                <div className="crate-success-banner">
                  <Check size={16} />
                  <span>Bespoke Crate Added to Allocation Bag</span>
                </div>
              ) : (
                <button 
                  className="btn-luxury builder-submit-btn"
                  disabled={getCompositionTotal() !== crateSize}
                  onClick={handleAddCrateToCart}
                >
                  Reserve Bespoke Crate
                </button>
              )}
              <p className="crate-note">
                *Crates are hand-finished in our French workshop. Includes brass hardware and signed authenticity certificate.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Collection;