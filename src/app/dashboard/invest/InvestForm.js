'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { FaBitcoin } from 'react-icons/fa'
import { FiUpload, FiCheckCircle, FiInfo } from 'react-icons/fi' // Cleaning up other icons if needed, but I'll stick to fixing Bitcoin first.
import { basePlans } from '@/lib/investment'



const paymentMethods = ['Bank Transfer']

const walletInfo = {
  'Bitcoin (BTC)': { address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', label: 'BTC Address' },
  'USDT (TRC20)': { address: 'TRx7NHqjeKQxGTCi8q8ZY4pL5cBkJAfjqg', label: 'USDT TRC20 Address' },
  'USDT (ERC20)': { address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', label: 'USDT ERC20 Address' },
  'Bank Transfer': { address: 'Contact support for bank details', label: 'Bank Details' },
}

export default function InvestForm({ userRate }) {
  const router = useRouter()
  const [plan, setPlan] = useState('')
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  function handleFile(e) {
    const f = e.target.files[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) { toast.error('File must be under 5MB.'); return }
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!plan) { toast.error('Please select an investment plan.'); return }
    
    // Convert back to USD implicitly for validation and storing
    const usdEquivalent = Number(amount) / userRate.amount;
    const selectedPlan = basePlans.find(p => p.id === plan);
    
    if (!amount || isNaN(amount) || usdEquivalent < selectedPlan.min || usdEquivalent > selectedPlan.max) { 
      toast.error(`Please enter an amount between ${userRate.symbol}${(selectedPlan.min * userRate.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })} and ${userRate.symbol}${(selectedPlan.max * userRate.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })} for the ${selectedPlan.name}.`); 
      return 
    }
    if (!method) { toast.error('Please select a payment method.'); return }
    if (!file) { toast.error('Please upload a payment screenshot.'); return }

    setLoading(true)
    try {
      // Upload screenshot
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed.')

      // Submit investment
      const res = await fetch('/api/dashboard/invest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          amount: Number(usdEquivalent.toFixed(2)),
          paymentMethod: method,
          screenshot: uploadData.url,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        console.log (data)
        throw new Error(data.error || 'Submission failed.')
      }

      toast.success('Investment submitted! Awaiting confirmation.')
      router.push('/dashboard/transactions')
    } catch (err) {
      toast.error(err.message)
      console.log (err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: '700', marginBottom: '6px' }}>New Investment</h1>
        <p style={{ color: '#555', fontSize: '14px' }}>Choose a plan, send payment, and upload your proof.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Form */}
        <div style={{ flex: 2 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Plan Selection */}
            <div>
              <label style={{ display: 'block', color: '#888', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Investment Plan</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {basePlans.map(p => (
                  <label key={p.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 18px', borderRadius: '10px', cursor: 'pointer',
                    border: `1px solid ${plan === p.id ? p.color + '60' : 'rgba(255,255,255,0.07)'}`,
                    background: plan === p.id ? `${p.color}10` : '#111',
                    transition: 'all 0.2s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="radio" name="plan" value={p.id} checked={plan === p.id} onChange={() => setPlan(p.id)} style={{ accentColor: p.color, width: '16px', height: '16px' }} />
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px', color: plan === p.id ? p.color : '#ddd' }}>{p.name}</div>
                        <div style={{ fontSize: '12px', color: '#555', marginTop: '1px' }}>
                          {userRate.symbol}{(p.min * userRate.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })} – {userRate.symbol}{(p.max * userRate.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: p.color }}>{p.returns}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label style={{ display: 'block', color: '#888', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Amount ({userRate.code})</label>
              <input
                className="input-dark"
                type="number"
                placeholder={`e.g. ${(500 * userRate.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>

            {/* Payment Method */}
            <div>
              <label style={{ display: 'block', color: '#888', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Payment Method</label>
              <select
                className="input-dark"
                value={method}
                onChange={e => setMethod(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                <option value="">Select payment method</option>
                {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Screenshot Upload */}
            <div>
              <label style={{ display: 'block', color: '#888', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Payment Screenshot</label>
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                border: `2px dashed ${file ? 'rgba(0,200,150,0.4)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '10px', padding: '28px',
                cursor: 'pointer', transition: 'border-color 0.2s',
                background: file ? 'rgba(0,200,150,0.04)' : 'transparent',
              }}>
                <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                {preview ? (
                  <>
                    <img src={preview} alt="Preview" style={{ maxHeight: '140px', maxWidth: '100%', borderRadius: '6px', marginBottom: '8px', objectFit: 'contain' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00c896', fontSize: '12px' }}>
                      <FiCheckCircle size={14} /> Screenshot selected
                    </div>
                  </>
                ) : (
                  <>
                    <FiUpload size={28} color="#444" style={{ marginBottom: '8px' }} />
                    <p style={{ color: '#555', fontSize: '13px', textAlign: 'center' }}>Click to upload payment screenshot</p>
                    <p style={{ color: '#333', fontSize: '11px', marginTop: '4px' }}>PNG, JPG, WEBP — max 5MB</p>
                  </>
                )}
              </label>
            </div>

            <button type="submit" className="btn-accent" disabled={true} style={{ padding: '13px', fontSize: '15px', opacity: 0.6, cursor: 'not-allowed' }}>
              {loading ? 'Submitting...' : 'Submit Investment (Disabled)'}
            </button>
          </form>
        </div>

        {/* Wallet Info Panel */}
        <div>
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px', position: 'sticky', top: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiInfo color="#3b82f6" />
              Payment Instructions
            </h3>

            {method && walletInfo[method] ? (
              <div>
                <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.7', marginBottom: '16px' }}>
                  Click below to securely retrieve our official payment instructions.
                </p>
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    background: 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  Get Payment Details
                </button>
                <div style={{ marginTop: '14px', padding: '12px', background: 'rgba(0,200,150,0.06)', border: '1px solid rgba(0,200,150,0.15)', borderRadius: '8px' }}>
                  <p style={{ color: '#00c896', fontSize: '12px', lineHeight: '1.6' }}>
                    ✓ After obtaining details and sending payment, upload your screenshot to verify.
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0', color: '#333' }}>
                <FaBitcoin size={32} style={{ margin: '0 auto 10px', display: 'block' }} />
                <p style={{ fontSize: '13px' }}>Select a payment method to see wallet details</p>
              </div>
            )}

            <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
              <p style={{ color: '#444', fontSize: '12px', lineHeight: '1.6' }}>
                ⚠ Only send the exact amount you want to invest. Incorrect amounts may delay processing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#111',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <FiInfo size={32} color="#3b82f6" />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#fff' }}>Contact Admin</h2>
            <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
              Please contact the administrator via Live Chat or support email to receive the official Bank Transfer details for your preferred currency.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="btn-accent"
              style={{ width: '100%', padding: '12px', fontSize: '15px' }}
            >
              Okay, I understand
            </button>
          </div>
        </div>
      )}
    </div>
  )
}