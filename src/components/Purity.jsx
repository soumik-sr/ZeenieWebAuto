import React, { useState } from 'react';
import './Purity.css';
import { ShieldCheck, Award, Heart, HelpCircle, Activity, Droplets } from 'lucide-react';

function Purity() {
  const [selectedMineral, setSelectedMineral] = useState('silica');

  // Mineral signature database
  const mineralData = {
    silica: {
      name: 'Silica (SiO₂)',
      concentration: '48 mg/L',
      tapComparison: '2 mg/L',
      percentage: 85, // for progress bar
      tasteProfile: 'Delivers a remarkably silky, velvety, and soft texture to the water.',
      healthBenefits: 'Crucial for collagen synthesis, bone density, healthy skin elasticity, and cardiovascular elasticity.',
      geology: 'Absorbed as water slowly filters through deep volcanic basalt sands and quartz strata over 100 years.'
    },
    magnesium: {
      name: 'Magnesium (Mg²⁺)',
      concentration: '26 mg/L',
      tapComparison: '4 mg/L',
      percentage: 60,
      tasteProfile: 'Provides a very subtle, pleasant mineral structure and crisp refreshing finish.',
      healthBenefits: 'Supports cellular energy production, nerve transmission, muscle recovery, and sleep quality.',
      geology: 'Leached from deep underground dolomite structures and granite fissures.'
    },
    calcium: {
      name: 'Calcium (Ca²⁺)',
      concentration: '54 mg/L',
      tapComparison: '12 mg/L',
      percentage: 70,
      tasteProfile: 'Contributes to a solid body and structural complexity, ideal for wine pairings.',
      healthBenefits: 'Essential for skeletal integrity, muscle function, and blood coagulation.',
      geology: 'Sourced from prehistoric limestone beds located deep beneath the alpine valley.'
    },
    potassium: {
      name: 'Potassium (K⁺)',
      concentration: '6 mg/L',
      tapComparison: '1 mg/L',
      percentage: 30,
      tasteProfile: 'Ensures a neutral, clean, and balanced finish with zero heavy aftertaste.',
      healthBenefits: 'Helps regulate cellular fluid balance, hydration speed, and electrolyte conductivity.',
      geology: 'Extracted from igneous rock layers containing potassium-rich feldspar.'
    }
  };

  const currentMineral = mineralData[selectedMineral];

  return (
    <div className="purity-page-wrapper">
      {/* --- HERO HEADER --- */}
      <section className="purity-hero">
        <div className="container text-center">
          <span className="section-badge">CLINICAL SIGNATURE</span>
          <h1 className="page-title">The Science of Purity</h1>
          <p className="page-subtitle">
            AÉTHER possesses an exceptional mineral composition. Discover the precise subterranean geology that refines every drop.
          </p>
        </div>
      </section>

      {/* --- MINERAL DASHBOARD --- */}
      <section className="dashboard-section section-padding">
        <div className="container dashboard-grid">
          {/* Menu / Selection Side */}
          <div className="dashboard-menu-panel">
            <span className="section-badge">MINERAL SIGNATURE</span>
            <h2 className="section-title">The Ionic Balance</h2>
            <p className="dashboard-intro">
              Unlike industrial waters that strip minerals and add synthetic salts, AÉTHER’s mineral profile is 100% natural, balanced by nature over 150 years.
            </p>
            
            <div className="mineral-buttons-list">
              {Object.keys(mineralData).map((key) => (
                <button
                  key={key}
                  className={`mineral-selection-btn ${selectedMineral === key ? 'active' : ''}`}
                  onClick={() => setSelectedMineral(key)}
                >
                  <div className="btn-inner-row">
                    <Droplets size={16} className="droplet-icon" />
                    <div className="btn-text-col">
                      <strong>{mineralData[key].name}</strong>
                      <span>{mineralData[key].concentration}</span>
                    </div>
                  </div>
                  <span className="btn-arrow">→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Details / Active Panel Side */}
          <div className="dashboard-active-panel">
            <div className="active-panel-header">
              <div className="panel-title-row">
                <span className="chemical-symbol">{currentMineral.name.split(' ')[1]}</span>
                <div>
                  <h3>{currentMineral.name.split(' ')[0]}</h3>
                  <p>NATURAL IONIC CONCENTRATION</p>
                </div>
              </div>
              <div className="panel-concentration">{currentMineral.concentration}</div>
            </div>

            {/* Meter Gauge */}
            <div className="meter-gauge-wrapper">
              <div className="meter-labels">
                <span>Concentration Level</span>
                <span>{currentMineral.percentage}% of Ideal Balance</span>
              </div>
              <div className="meter-track">
                <div 
                  className="meter-fill" 
                  style={{ width: `${currentMineral.percentage}%` }}
                ></div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="comparison-card">
              <div className="comparison-row header">
                <span>WATER SOURCE</span>
                <span>CONCENTRATION</span>
              </div>
              <div className="comparison-row target">
                <span>AÉTHER Glacial Spring</span>
                <span>{currentMineral.concentration}</span>
              </div>
              <div className="comparison-row">
                <span>Typical Tap Water</span>
                <span>{currentMineral.tapComparison}</span>
              </div>
              <div className="comparison-row">
                <span>Standard Bottled Water</span>
                <span>{(parseFloat(currentMineral.tapComparison) * 1.5).toFixed(0)} mg/L</span>
              </div>
            </div>

            {/* Detailed descriptions */}
            <div className="mineral-details-grid">
              <div className="detail-box">
                <h4><Activity size={14} /> GASTRONOMIC PROFILE</h4>
                <p>{currentMineral.tasteProfile}</p>
              </div>
              
              <div className="detail-box">
                <h4><Heart size={14} /> CELLULAR BENEFITS</h4>
                <p>{currentMineral.healthBenefits}</p>
              </div>

              <div className="detail-box full-width">
                <h4><Award size={14} /> GEOLOGICAL FOOTPRINT</h4>
                <p>{currentMineral.geology}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- GEOLOGICAL TIMELINE --- */}
      <section className="timeline-section section-padding">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '5rem' }}>
            <span className="section-badge">HYDROLOGICAL CHRONOLOGY</span>
            <h2 className="section-title">The Filtration Journey</h2>
            <p className="page-subtitle">
              Tracing the 150-year passage of a single drop of AÉTHER water through the core of alpine geology.
            </p>
          </div>

          <div className="timeline-wrapper">
            {/* Step 1 */}
            <div className="timeline-step">
              <div className="timeline-circle">01</div>
              <div className="timeline-content">
                <h3>Glacial Glaciation</h3>
                <p className="timeline-meta">YEAR 0</p>
                <p>Pure snow falls on alpine glacier peaks at 3,000m altitude. The water is frozen instantly, preserving its pre-industrial purity and molecular structure.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="timeline-step">
              <div className="timeline-circle">02</div>
              <div className="timeline-content">
                <h3>Granite Seepage</h3>
                <p className="timeline-meta">YEARS 1 – 40</p>
                <p>As glacial core ice melts under solar pressure, water seeps into deep granite fissures, filtering out suspended micro-particles through quartz sands.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="timeline-step">
              <div className="timeline-circle">03</div>
              <div className="timeline-content">
                <h3>Basalt Percolation</h3>
                <p className="timeline-meta">YEARS 40 – 140</p>
                <p>Water slowly percolates through miles of igneous basalt chambers. Under extreme pressure and temperature, it naturally absorbs Silica and Magnesium.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="timeline-step">
              <div className="timeline-circle">04</div>
              <div className="timeline-content">
                <h3>Artesian Extraction</h3>
                <p className="timeline-meta">YEAR 150</p>
                <p>Arriving at a deep artesian reservoir 2,500m below the surface, the water is naturally pressurized. Sourced with zero mechanical pumping to preserve equilibrium.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TECHNICAL ANALYSIS --- */}
      <section className="analysis-section section-padding">
        <div className="container analysis-container">
          <div className="analysis-text">
            <span className="section-badge">LABORATORY AUDIT</span>
            <h2 className="section-title">Certified Analysis</h2>
            <p>
              Every bottling run of AÉTHER is analyzed by the independent *Laboratoire Hydrologique Européen* to ensure absolute compliance with our strict clinical standards.
            </p>
            
            <div className="analysis-specs-list">
              <div className="analysis-spec-item">
                <span>Total Dissolved Solids (TDS)</span>
                <span>240 mg/L</span>
              </div>
              <div className="analysis-spec-item">
                <span>Nitrates</span>
                <span>&lt; 0.1 mg/L (Undetectable)</span>
              </div>
              <div className="analysis-spec-item">
                <span>Sodium</span>
                <span>4.2 mg/L (Ultra-Low)</span>
              </div>
              <div className="analysis-spec-item">
                <span>Oxygen Saturation</span>
                <span>10.2 mg/L</span>
              </div>
            </div>
          </div>

          <div className="analysis-visual">
            <ShieldCheck size={80} strokeWidth={0.5} className="shield-pulse-icon" />
            <h3>100% Purity Certified</h3>
            <p>Certified free of microplastics, chemical runoff, and heavy metals. Pure mineral equilibrium.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Purity;