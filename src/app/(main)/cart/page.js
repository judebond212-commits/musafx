'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TELEGRAM_URL } from '@/lib/telegram'
import { FiArrowLeft, FiShoppingCart, FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiPlus, FiMinus } from 'react-icons/fi'

const CYAN = '#22d3ee'

export default function CartPage() {
  const router = useRouter()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    billingAddress: ''
  })

  useEffect(() => {
    const savedPlan = localStorage.getItem('selectedPlan')
    if (savedPlan) {
      try {
        setPlan(JSON.parse(savedPlan))
      } catch (e) {
        console.error('Failed to parse plan', e)
      }
    }
    setLoading(false)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta))
  }

  const getNumericPrice = (priceStr) => {
    return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0
  }

  const handleContinue = (e) => {
    e.preventDefault()
    // Simple validation
    if (!form.fullName || !form.email || !form.phone || !form.billingAddress) {
      alert('Please fill in all details to continue.')
      return
    }
    
    // Redirect to Telegram
    window.open(TELEGRAM_URL, '_blank')
  }

  if (loading) return null

  if (!plan) {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <FiShoppingCart size={64} color="#333" style={{ marginBottom: '24px' }} />
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>Your cart is empty</h1>
        <p style={{ color: '#888', marginBottom: '32px' }}>Please select a plan to proceed with your purchase.</p>
        <button 
          onClick={() => router.push('/autopilotpro')}
          style={{ background: CYAN, color: '#000', padding: '12px 32px', borderRadius: '8px', fontWeight: '700', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          View Plans
        </button>
      </div>
    )
  }

  const numericPrice = getNumericPrice(plan.price)
  const totalPrice = (numericPrice * quantity).toFixed(2)

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', padding: '120px 20px 80px' }}>
      <style>{`
        .input-group { position: relative; margin-bottom: 24px; }
        .input-group input, .input-group textarea {
          width: 100%;
          background: #111 !important;
          border: 1px solid rgba(255,255,255,0.07) !important;
          border-radius: 8px !important;
          padding: 14px 14px 14px 44px !important;
          color: #fff !important;
          font-family: inherit !important;
          font-size: 15px !important;
          transition: all 0.3s !important;
        }
        .input-group input:focus, .input-group textarea:focus {
          border-color: ${CYAN} !important;
          outline: none !important;
          box-shadow: 0 0 0 4px ${CYAN}11 !important;
        }
        .input-group svg {
          position: absolute;
          left: 14px;
          top: 16px;
          color: #555;
          transition: color 0.3s;
          z-index: 1;
        }
        .input-group input:focus + svg, .input-group textarea:focus + svg {
          color: ${CYAN};
        }
        .qty-btn {
          background: #222;
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .qty-btn:hover {
          background: #333;
          border-color: ${CYAN}44;
          color: ${CYAN};
        }
        @media(max-width: 992px) {
          .cart-container { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <button 
          onClick={() => router.back()}
          style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontSize: '14px', fontFamily: 'inherit' }}
        >
          <FiArrowLeft /> Back to plans
        </button>

        <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: '800', marginBottom: '48px', letterSpacing: '-0.02em' }}>
          Complete Your <span style={{ color: CYAN }}>Order</span>
        </h1>

        <div className="cart-container" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '48px', alignItems: 'start' }}>
          {/* Form Side */}
          <div>
            <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FiUser color={CYAN} /> Contact & Billing Information
              </h2>

              <form onSubmit={handleContinue}>
                <div className="input-group">
                  <FiUser />
                  <input 
                    type="text" 
                    name="fullName" 
                    placeholder="Full Name" 
                    required 
                    value={form.fullName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="input-group">
                  <FiMail />
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Email Address" 
                    required 
                    value={form.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="input-group">
                  <FiPhone />
                  <input 
                    type="tel" 
                    name="phone" 
                    placeholder="Phone Number (e.g. +1 234 567 890)" 
                    required 
                    value={form.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="input-group">
                  <FiMapPin />
                  <textarea 
                    name="billingAddress" 
                    placeholder="Billing Address" 
                    required 
                    rows="3"
                    value={form.billingAddress}
                    onChange={handleInputChange}
                    style={{ paddingLeft: '44px', resize: 'none' }}
                  />
                </div>

                <div style={{ marginTop: '40px', padding: '16px', background: 'rgba(34, 211, 238, 0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FiLock color={CYAN} />
                  <p style={{ fontSize: '13px', color: '#aaa', margin: 0 }}>
                    Your information is used only to process your order via Telegram.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Summary Side */}
          <div className="summary-side">
            <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '32px', position: 'sticky', top: '100px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '32px' }}>Order Summary</h2>
              
              <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', background: '#222' }}>
                  {plan.img && <img src={plan.img} alt={plan.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: CYAN, fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Membership</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', marginBottom: '4px' }}>{plan.title}</div>
                  <div style={{ color: '#555', fontSize: '14px', marginBottom: '12px' }}>One-off lifetime access</div>
                  
                  {/* Quantity Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button type="button" className="qty-btn" onClick={() => handleQuantityChange(-1)}>
                      <FiMinus size={14} />
                    </button>
                    <span style={{ fontWeight: '700', fontSize: '15px', minWidth: '20px', textAlign: 'center' }}>{quantity}</span>
                    <button type="button" className="qty-btn" onClick={() => handleQuantityChange(1)}>
                      <FiPlus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#888' }}>Price per unit</span>
                  <span>{plan.price}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#888' }}>Quantity</span>
                  <span>x{quantity}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#888' }}>Tax</span>
                  <span>$0.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontSize: '20px', fontWeight: '800' }}>
                  <span>Total</span>
                  <span style={{ color: CYAN }}>${totalPrice}</span>
                </div>
              </div>

              <button 
                onClick={handleContinue}
                style={{
                  width: '100%',
                  background: CYAN,
                  color: '#000',
                  padding: '18px',
                  borderRadius: '12px',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '16px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  boxShadow: `0 8px 30px ${CYAN}33`,
                  transition: 'transform 0.2s',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                CONTINUE TO PAYMENT
              </button>
              
              <p style={{ textAlign: 'center', marginTop: '20px', color: '#555', fontSize: '12px' }}>
                You will be redirected to Telegram to complete payment securely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
