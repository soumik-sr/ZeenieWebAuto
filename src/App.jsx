import React, { useState, useEffect } from 'react';
import './App.css';

// Import Components
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './components/Home.jsx';
import Collection from './components/Collection.jsx';
import Purity from './components/Purity.jsx';
import Contact from './components/Contact.jsx';

// Import Icons
import { X, ShoppingBag, Trash2, Plus, Minus, Check, Sparkles } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Smooth scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Cart Management Functions
  const addToCart = (item) => {
    setCart((prevCart) => {
      // Check if item already exists (and matches specs if it's a crate)
      const existingItemIndex = prevCart.findIndex((cartItem) => {
        if (cartItem.id !== item.id) return false;
        if (cartItem.isCrate && item.isCrate) {
          // Compare crate details
          return (
            cartItem.crateDetails.size === item.crateDetails.size &&
            cartItem.crateDetails.finish === item.crateDetails.finish &&
            JSON.stringify(cartItem.crateDetails.composition) === JSON.stringify(item.crateDetails.composition)
          );
        }
        return !cartItem.isCrate && !item.isCrate;
      });

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += item.quantity || 1;
        return newCart;
      }

      return [...prevCart, { ...item, quantity: item.quantity || 1 }];
    });
    
    // Open cart automatically when an item is added
    setIsCartOpen(true);
  };

  const removeFromCart = (uniqueId) => {
    setCart((prevCart) => prevCart.filter((item, index) => {
      const itemUniqueId = item.isCrate 
        ? `${item.id}-${item.crateDetails.size}-${item.crateDetails.finish}`
        : `${item.id}`;
      const targetUniqueId = uniqueId;
      // If index-based is safer, we can use index. Let's use index or custom composite key.
      const currentUniqueId = item.isCrate 
        ? `${item.id}-${index}`
        : `${item.id}-${index}`;
      return currentUniqueId !== targetUniqueId;
    }));
  };

  const updateQuantity = (index, change) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      const targetItem = newCart[index];
      if (!targetItem) return prevCart;
      
      const newQty = targetItem.quantity + change;
      if (newQty <= 0) {
        // Remove item if quantity falls to 0
        return prevCart.filter((_, idx) => idx !== index);
      }
      
      newCart[index] = { ...targetItem, quantity: newQty };
      return newCart;
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Handle allocation submission
  const handleCheckoutSubmit = (clientInfo) => {
    const referenceId = `AE-${Math.floor(100000 + Math.random() * 900000)}`;
    setModalData({
      referenceId,
      clientName: clientInfo.name,
      clientEmail: clientInfo.email,
      totalAmount: getCartTotal(),
      itemCount: getCartCount(),
    });
    
    // Clear cart and close drawer, then open modal
    setCart([]);
    setIsCartOpen(false);
    setIsModalOpen(true);
  };

  // Render current component
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} addToCart={addToCart} />;
      case 'collection':
        return <Collection addToCart={addToCart} />;
      case 'purity':
        return <Purity />;
      case 'contact':
        return <Contact handleCheckoutSubmit={handleCheckoutSubmit} cartItems={cart} cartTotal={getCartTotal()} />;
      default:
        return <Home setCurrentPage={setCurrentPage} addToCart={addToCart} />;
    }
  };

  return (
    <div className="app-wrapper">
      {/* Header Navigation */}
      <Header 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        cartCount={getCartCount()} 
        setIsCartOpen={setIsCartOpen} 
      />

      {/* Main Content Area */}
      <main>
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer setCurrentPage={setCurrentPage} />

      {/* --- CART / ALLOCATION DRAWER --- */}
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}>
        <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="cart-header">
            <h2>Your Allocation</h2>
            <button className="close-cart-btn" onClick={() => setIsCartOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="cart-items-container">
            {cart.length === 0 ? (
              <div className="empty-cart-state">
                <ShoppingBag size={48} strokeWidth={1} color="var(--accent-platinum)" />
                <p>Your allocation bag is currently empty.</p>
                <button 
                  className="btn-luxury-outline" 
                  style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', fontSize: '0.7rem' }}
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentPage('collection');
                  }}
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item, index) => {
                const itemUniqueId = item.isCrate 
                  ? `${item.id}-${index}`
                  : `${item.id}-${index}`;
                
                return (
                  <div className="cart-item" key={itemUniqueId}>
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="cart-item-details">
                      <div className="cart-item-title-row">
                        <div>
                          <h3>{item.name}</h3>
                          <p className="cart-item-meta">{item.volume}</p>
                        </div>
                        <button className="remove-item-btn" onClick={() => removeFromCart(itemUniqueId)}>
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {item.isCrate && (
                        <div className="cart-item-crate-specs">
                          <strong>Crate Specs:</strong> {item.crateDetails.size}-Bottle {item.crateDetails.finish} Chest
                          <br />
                          {Object.entries(item.crateDetails.composition)
                            .filter(([_, qty]) => qty > 0)
                            .map(([key, qty]) => `${qty}x ${key.toUpperCase()}`)
                            .join(', ')}
                        </div>
                      )}

                      <div className="cart-item-controls-row">
                        <div className="quantity-controller">
                          <button className="qty-btn" onClick={() => updateQuantity(index, -1)}>
                            <Minus size={12} />
                          </button>
                          <span className="qty-val">{item.quantity}</span>
                          <button className="qty-btn" onClick={() => updateQuantity(index, 1)}>
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-summary-row">
                <span>Estimated Subtotal</span>
                <span className="total-price">${getCartTotal().toFixed(2)}</span>
              </div>
              <button 
                className="btn-luxury checkout-btn"
                onClick={() => {
                  setIsCartOpen(false);
                  setCurrentPage('contact');
                }}
              >
                Proceed to Registry
              </button>
              <p className="cart-footer-note">
                White-glove delivery, temperature-controlled transit, and custom custom-crate engraving are finalized during registry.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- INQUIRY SUCCESS MODAL --- */}
      <div className={`modal-backdrop ${isModalOpen ? 'open' : ''}`}>
        <div className="modal-content">
          <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
            <X size={20} />
          </button>
          
          <div className="success-icon-wrapper">
            <Check size={36} strokeWidth={2} />
            <Sparkles className="sparkles-icon" size={20} />
          </div>

          <h2>Allocation Registered</h2>
          <p className="modal-subtitle">Aéther Private Client Services</p>
          
          <p className="modal-description">
            Thank you, <strong>{modalData?.clientName}</strong>. Your allocation request has been logged into our private registry. A client concierge will contact you within 4 hours to verify delivery logistics.
          </p>

          <div className="receipt-box">
            <div className="receipt-title">Allocation Details</div>
            <div className="receipt-row">
              <span className="receipt-label">Registry Reference</span>
              <span className="receipt-value gold">{modalData?.referenceId}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Client Email</span>
              <span className="receipt-value">{modalData?.clientEmail}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Total Items</span>
              <span className="receipt-value">{modalData?.itemCount} Bottles</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Estimated Value</span>
              <span className="receipt-value">${modalData?.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <button className="btn-luxury" onClick={() => setIsModalOpen(false)}>
            Return to Atelier
          </button>
          
          <p className="modal-footer-text" style={{ marginTop: '1.5rem', fontSize: '0.7rem' }}>
            A copy of this allocation summary has been sent to {modalData?.clientEmail}.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;