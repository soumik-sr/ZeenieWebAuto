import React, { useState } from 'react';
import './Contact.css';
import { Mail, Phone, MapPin, Clock, ShieldCheck, Sparkles } from 'lucide-react';

function Contact({ handleCheckoutSubmit, cartItems, cartTotal }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    deliveryDate: '',
    allocationType: 'Private Estate',
    address: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      // Trigger checkout callback in App.jsx
      handleCheckoutSubmit(formData);
    }
  };

  return (
    <div className="contact-page-wrapper">
      {/* --- HERO HEADER --- */}
      <section className="contact-hero">
        <div className="container text-center">
          <span className="section-badge">PRIVATE CLIENT SERVICES</span>
          <h1 className="page-title">The Private Registry</h1>
          <p className="page-subtitle">
            Secure your personal allocation, coordinate superyacht logistics, or establish scheduled cellar deliveries with our concierge team.
          </p>
        </div>
      </section>

      {/* --- REGISTRY SECTION --- */}
      <section className="registry-section section-padding">
        <div className="container registry-grid">
          {/* Form Side */}
          <div className="registry-form-panel">
            <span className="section-badge">ALLOCATION REGISTRY</span>
            <h2>Secure Private Allocation</h2>
            <p className="form-intro">
              Please complete the client profile below. Our client services team will review your requirements and contact you within 4 hours to verify delivery logistics.
            </p>

            <form className="registry-form" onSubmit={handleSubmit}>
              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="name">FULL NAME</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    placeholder="E.G. CHANCELLOR STERLING"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    placeholder="CLIENT@ESTATE.COM"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="phone">CONTACT TELEPHONE</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    placeholder="+1 (555) 019-9011"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="deliveryDate">PREFERRED DELIVERY DATE</label>
                  <input 
                    type="date" 
                    id="deliveryDate" 
                    name="deliveryDate" 
                    value={formData.deliveryDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="allocationType">ALLOCATION CATEGORY</label>
                <select 
                  id="allocationType" 
                  name="allocationType"
                  value={formData.allocationType}
                  onChange={handleChange}
                >
                  <option value="Private Estate">Private Estate / Residence</option>
                  <option value="Superyacht">Superyacht / Marine Logistics</option>
                  <option value="Michelin Restaurant">Michelin-Starred Restaurant</option>
                  <option value="Special Event">Special High-Society Event</option>
                  <option value="Corporate HQ">Corporate Headquarters</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="address">DELIVERY / SECURE PORT ADDRESS</label>
                <textarea 
                  id="address" 
                  name="address" 
                  rows="3" 
                  placeholder="ENTER SECURE ESTABLISHMENT OR PORT LOCATION"
                  value={formData.address}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="notes">BESPOKE DELIVERY INSTRUCTIONS (OPTIONAL)</label>
                <textarea 
                  id="notes" 
                  name="notes" 
                  rows="4" 
                  placeholder="E.G. TEMPERATURE-CONTROLLED CELLAR DEPOSIT, ENGRAVING SPECIFICS, HELIPAD ACCESS DETAILS"
                  value={formData.notes}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button type="submit" className="btn-luxury submit-registry-btn">
                Submit Private Registry
              </button>
            </form>
          </div>

          {/* Allocation Summary Side */}
          <div className="registry-summary-panel">
            {cartItems.length > 0 ? (
              <div className="summary-sticky-card">
                <div className="summary-card-header">
                  <Sparkles size={16} color="var(--accent-gold-dark)" />
                  <h3>Allocation Summary</h3>
                </div>
                
                <div className="summary-items-list">
                  {cartItems.map((item, idx) => (
                    <div className="summary-item-row" key={idx}>
                      <div className="summary-item-info">
                        <strong>{item.name}</strong>
                        <span>Qty: {item.quantity} • {item.volume}</span>
                      </div>
                      <span className="summary-item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="summary-total-block">
                  <div className="total-row">
                    <span>Estimated Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="total-row">
                    <span>Concierge Handling</span>
                    <span className="gold">COMPLIMENTARY</span>
                  </div>
                  <div className="total-row grand-total">
                    <span>ESTIMATED TOTAL</span>
                    <span className="price">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="summary-card-footer">
                  <ShieldCheck size={18} />
                  <span>Secure temperature-controlled transit and custom custom-crate engraving are included.</span>
                </div>
              </div>
            ) : (
              <div className="concierge-info-card">
                <div className="concierge-card-header">
                  <h3>Atelier Client Services</h3>
                  <p>DIRECT CONCIERGE CHANNELS</p>
                </div>
                
                <div className="concierge-channels-list">
                  <div className="channel-item">
                    <Phone strokeWidth={1} size={24} />
                    <div>
                      <h4>TELEPHONE</h4>
                      <p className="highlight">+1 (800) 901-AETH</p>
                      <p>Toll-free globally. 24/7 client access.</p>
                    </div>
                  </div>

                  <div className="channel-item">
                    <Mail strokeWidth={1} size={24} />
                    <div>
                      <h4>SECURE EMAIL</h4>
                      <p className="highlight">concierge@aetherwater.com</p>
                      <p>PGP keys available upon request.</p>
                    </div>
                  </div>

                  <div className="channel-item">
                    <Clock strokeWidth={1} size={24} />
                    <div>
                      <h4>RESPONSE SLA</h4>
                      <p className="highlight">Under 4 Hours</p>
                      <p>Guaranteed response from a dedicated concierge.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- ATELIER LOCATIONS --- */}
      <section className="boutiques-section section-padding">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '5rem' }}>
            <span className="section-badge">GLOBAL ATELIERS</span>
            <h2 className="section-title">Visit Our Boutiques</h2>
            <p className="page-subtitle">
              Experience the full collection firsthand and consult with a water sommelier at our flagship locations.
            </p>
          </div>

          <div className="boutiques-grid">
            {/* Boutique 1 */}
            <div className="boutique-card">
              <div className="boutique-image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80" 
                  alt="Atelier Paris Boutique Interior" 
                />
              </div>
              <div className="boutique-info">
                <h3>ATELIER PARIS</h3>
                <div className="boutique-details">
                  <div className="detail-row">
                    <MapPin size={16} className="detail-icon" />
                    <span>12 Place Vendôme, 75001 Paris, France</span>
                  </div>
                  <div className="detail-row">
                    <Phone size={16} className="detail-icon" />
                    <span>+33 (1) 42 68 53 00</span>
                  </div>
                  <div className="detail-row">
                    <Clock size={16} className="detail-icon" />
                    <span>Mon – Sat: 10:00 – 19:00 (Closed Sundays)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Boutique 2 */}
            <div className="boutique-card">
              <div className="boutique-image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" 
                  alt="Atelier Monaco Boutique Interior" 
                />
              </div>
              <div className="boutique-info">
                <h3>ATELIER MONACO</h3>
                <div className="boutique-details">
                  <div className="detail-row">
                    <MapPin size={16} className="detail-icon" />
                    <span>Avenue de Monte-Carlo, 98000 Monaco</span>
                  </div>
                  <div className="detail-row">
                    <Phone size={16} className="detail-icon" />
                    <span>+377 97 97 40 00</span>
                  </div>
                  <div className="detail-row">
                    <Clock size={16} className="detail-icon" />
                    <span>Mon – Sat: 11:00 – 20:00 (Closed Sundays)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;