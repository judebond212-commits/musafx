'use client'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { HiUsers, HiSearch, HiEye, HiX, HiPlus, HiMinus } from 'react-icons/hi'

function Toggle({ value, onChange, loading }) {
  const isTrue = value === 'true'
  return (
    <button onClick={onChange} disabled={loading} style={{ width: '44px', height: '24px', borderRadius: '100px', border: 'none', cursor: 'pointer', background: isTrue ? '#00c896' : '#2a2a2a', position: 'relative', transition: 'background 0.2s', flexShrink: 0, opacity: loading ? 0.5 : 1 }}>
      <span style={{ position: 'absolute', top: '3px', left: isTrue ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s', display: 'block' }} />
    </button>
  )
}

function UserModal({ user, onClose, onUpdateField }) {
  const [fundAmount, setFundAmount] = useState('')
  const [investPlan, setInvestPlan] = useState('basic')
  const [loading, setLoading] = useState(false)

  if (!user) return null

  async function handleFund() {
    const amount = parseFloat(fundAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Enter a valid positive amount.')
      return
    }

    setLoading(true)
    try {
      await onUpdateField(user.userID, 'fundUser', { plan: investPlan, amount })
      toast.success(`Successfully funded the user.`)
      setFundAmount('')
      
      // Optimistic UI fallback
      const currentAmount = parseFloat(user.investmentAmount) || 0
      user.investmentAmount = currentAmount + amount
      user.investmentPlan = investPlan
    } catch (err) {
      // toast error handled in parent
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    ['User ID', user.userID], ['Email', user.Email], ['First Name', user.FName], ['Last Name', user.LName],
    ['Country', user.Country || '—'], ['State', user.ST || '—'], ['Address', user.AD || '—'],
    ['Investment Plan', user.investmentPlan || '—'], ['Investment Amount', user.investmentAmount ? `$${parseFloat(user.investmentAmount).toLocaleString()}` : '$0'],
    ['Investment Date', user.investmentDate || '—'], ['Investment Enabled', user.InvestMentEnabled], ['Account Enabled', user.AccountEnabled],
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={onClose}>
      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '28px', width: '100%', maxWidth: '480px', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{user.FName} {user.LName}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><HiX size={20} /></button>
        </div>
        
        {/* Funding Input */}
        <div style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '10px', color: '#ccc' }}>Initiate Investment Feature</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <select
              className="input-dark"
              value={investPlan}
              onChange={(e) => setInvestPlan(e.target.value)}
              style={{ padding: '10px 14px', fontSize: '14px', cursor: 'pointer' }}
            >
              <option value="basic">Basic Plan</option>
              <option value="professional">Professional Plan</option>
              <option value="gold">Gold Plan</option>
              <option value="diamond">Diamond Plan</option>
            </select>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="number" 
                className="input-dark" 
                placeholder="Amount Paid (USD Equivalent)..." 
                value={fundAmount} 
                onChange={e => setFundAmount(e.target.value)} 
                style={{ flex: 1, padding: '10px 14px', fontSize: '14px' }} 
              />
              <button 
                onClick={handleFund}
                disabled={loading}
                style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px', padding: '0 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '13px' }}>
                <HiPlus size={16} /> Fund User
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {fields.map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: '#555', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
              <span style={{ color: '#ddd', fontSize: '13px', textAlign: 'right', maxWidth: '60%', wordBreak: 'break-word' }}>{String(value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [toggling, setToggling] = useState({})
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (data.users) setUsers(data.users)
    } catch { toast.error('Failed to load users.') }
    finally { setLoading(false) }
  }

  async function handleToggle(userID, field, currentValue) {
    const key = `${userID}-${field}`
    setToggling(prev => ({ ...prev, [key]: true }))
    const newValue = currentValue === 'true' ? 'false' : (currentValue === 'false' ? 'true' : currentValue)
    
    // Support complex object updates like funding array
    const finalValue = (field === 'investmentAmount') ? currentValue : newValue

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID, field, value: (field === 'fundUser' ? currentValue : finalValue) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      if (field === 'fundUser') {
        setUsers(prev => prev.map(u => u.userID === userID ? { ...u, investmentAmount: (parseFloat(u.investmentAmount) || 0) + currentValue.amount, investmentPlan: currentValue.plan } : u))
      } else {
        setUsers(prev => prev.map(u => u.userID === userID ? { ...u, [field]: finalValue } : u))
      }
      
      if (field !== 'investmentAmount' && field !== 'fundUser') toast.success(`Updated successfully.`)
    } catch (err) { 
      toast.error(err.message) 
      throw err // rethrow for UserModal
    }
    finally { setToggling(prev => ({ ...prev, [key]: false })) }
  }

  const filtered = users.filter(u =>
    !search ||
    u.Email?.toLowerCase().includes(search.toLowerCase()) ||
    `${u.FName} ${u.LName}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: '700', marginBottom: '6px' }}>User Management</h1>
        <p style={{ color: '#555', fontSize: '14px' }}>Manage users and fund accounts efficiently.</p>
      </div>

      <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} onUpdateField={handleToggle} />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Total Users', value: users.length, color: '#3b82f6' },
          { label: 'Active', value: users.filter(u => u.AccountEnabled === 'true').length, color: '#00c896' },
          { label: 'Investing', value: users.filter(u => u.InvestMentEnabled === 'true').length, color: '#3b82f6' },
          { label: 'Disabled', value: users.filter(u => u.AccountEnabled !== 'true').length, color: '#ff5555' },
        ].map(s => (
          <div key={s.label} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '16px' }}>
            <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600', marginBottom: '4px' }}>{s.label}</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', marginBottom: '18px', maxWidth: '340px' }}>
        <HiSearch size={16} color="#555" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input className="input-dark" placeholder="Search name or email..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '36px' }} />
      </div>

      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#444', fontSize: '14px' }}>Loading users...</div>
        ) : !filtered.length ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#444' }}>
            <HiUsers size={36} style={{ margin: '0 auto 10px', display: 'block', opacity: 0.2 }} />
            <p style={{ fontSize: '14px' }}>No users found.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '820px' }}>
              <thead>
                <tr style={{ background: '#0d0d0d', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['#', 'Full Name', 'Email', 'Plan', 'Amount', 'Acct On', 'Invest On', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 14px', color: '#555', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, i) => (
                  <tr key={user.userID} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <td style={{ padding: '13px 14px', color: '#444', fontSize: '12px' }}>{user.userID?.slice(0,6)}...</td>
                    <td style={{ padding: '13px 14px', fontWeight: '500', whiteSpace: 'nowrap' }}>{user.FName} {user.LName}</td>
                    <td style={{ padding: '13px 14px', color: '#888', fontSize: '12px' }}>{user.Email}</td>
                    <td style={{ padding: '13px 14px', color: '#3b82f6', fontSize: '12px', textTransform: 'capitalize' }}>{user.investmentPlan || '—'}</td>
                    <td style={{ padding: '13px 14px', fontWeight: '600' }}>${(parseFloat(user.investmentAmount) || 0).toLocaleString()}</td>
                    <td style={{ padding: '13px 14px' }}>
                      <Toggle value={user.AccountEnabled} loading={!!toggling[`${user.userID}-AccountEnabled`]} onChange={() => handleToggle(user.userID, 'AccountEnabled', user.AccountEnabled)} />
                    </td>
                    <td style={{ padding: '13px 14px' }}>
                      <Toggle value={user.InvestMentEnabled} loading={!!toggling[`${user.userID}-InvestMentEnabled`]} onChange={() => handleToggle(user.userID, 'InvestMentEnabled', user.InvestMentEnabled)} />
                    </td>
                    <td style={{ padding: '13px 14px' }}>
                      <button onClick={() => setSelectedUser(user)} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#aaa', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                        <HiEye size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
