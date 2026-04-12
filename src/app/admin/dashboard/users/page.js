'use client'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { HiUsers, HiSearch, HiEye, HiX, HiPlus, HiMinus, HiCheckCircle } from 'react-icons/hi'

import { basePlans, calculateCurrentBalance } from '@/lib/investment'

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
  const [investPlan, setInvestPlan] = useState(basePlans[0]?.id || '')
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
    } catch (err) {
      // toast error handled in parent
    } finally {
      setLoading(false)
    }
  }

  const currentBalance = calculateCurrentBalance(parseFloat(user.investmentAmount) || 0, user.investmentPlan, user.investmentDate)

  const fields = [
    ['User ID', user.userID], ['Email', user.Email], ['First Name', user.FName], ['Last Name', user.LName],
    ['Country', user.Country || '—'], ['Phone', user.ST || '—'], ['Address', user.AD || '—'],
    ['Investment Plan', user.investmentPlan || '—'], 
    ['Initial Investment', user.investmentAmount ? `$${parseFloat(user.investmentAmount).toLocaleString()}` : '$0'],
    ['Current Balance', `$${currentBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}`],
    ['Investment Date', user.investmentDate || '—'], 
  ]

  const toggles = [
    { label: 'Login Access', field: 'AccountEnabled', value: user.AccountEnabled },
    { label: 'Investment Feature', field: 'InvestMentEnabled', value: user.InvestMentEnabled },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Manage Account</h3>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#555', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><HiX size={18} /></button>
        </div>
        
        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          {toggles.map(t => (
            <div key={t.label} style={{ background: '#111', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ fontSize: '11px', fontWeight: '700', color: '#555', textTransform: 'uppercase' }}>{t.label}</div>
               <Toggle value={t.value} onChange={() => onUpdateField(user.userID, t.field, t.value)} />
            </div>
          ))}
        </div>

        {/* Funding Input */}
        <div style={{ marginBottom: '28px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.15)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', marginBottom: '14px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fund Active Investment</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <select
              className="input-dark"
              value={investPlan}
              onChange={(e) => setInvestPlan(e.target.value)}
              style={{ background: '#0a0a0a' }}
            >
              {basePlans.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="number" 
                className="input-dark" 
                placeholder="USD Amount" 
                value={fundAmount} 
                onChange={e => setFundAmount(e.target.value)} 
                style={{ flex: 1, background: '#0a0a0a' }} 
              />
              <button 
                onClick={handleFund}
                disabled={loading}
                style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '0 16px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
                {loading ? '...' : 'Fund'}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {fields.map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <span style={{ color: '#444', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
              <span style={{ color: '#aaa', fontSize: '13px', textAlign: 'right', maxWidth: '60%', wordBreak: 'break-word' }}>{String(value)}</span>
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
  const [migrating, setMigrating] = useState(false)
  const [migrationResult, setMigrationResult] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function startMigration() {
    if (!confirm('This will import all legacy data from SQL files. Users with existing emails will be skipped. Proceed?')) return
    setMigrating(true)
    setMigrationResult(null)
    try {
      const res = await fetch('/api/admin/migrate', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setMigrationResult(data)
        toast.success('Migration completed!')
        fetchUsers()
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setMigrating(false)
    }
  }

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
    
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID, field, value: (field === 'fundUser' ? currentValue : newValue) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      if (field === 'fundUser') {
        setUsers(prev => prev.map(u => u.userID === userID ? { ...u, investmentAmount: (parseFloat(u.investmentAmount) || 0) + currentValue.amount, investmentPlan: currentValue.plan } : u))
        setSelectedUser(prev => prev ? { ...prev, investmentAmount: (parseFloat(prev.investmentAmount) || 0) + currentValue.amount, investmentPlan: currentValue.plan } : null)
      } else {
        setUsers(prev => prev.map(u => u.userID === userID ? { ...u, [field]: newValue } : u))
        setSelectedUser(prev => prev ? { ...prev, [field]: newValue } : null)
      }
      
      if (field !== 'fundUser') toast.success(`Account settings updated.`)
    } catch (err) { 
      toast.error(err.message) 
      throw err 
    }
    finally { setToggling(prev => ({ ...prev, [key]: false })) }
  }

  const filtered = users.filter(u =>
    search.trim().length > 0 && (
      u.Email?.toLowerCase().includes(search.toLowerCase()) ||
      `${u.FName} ${u.LName}`.toLowerCase().includes(search.toLowerCase())
    )
  )

  const isSearchActive = search.trim().length > 0

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '800', marginBottom: '8px' }}>User Search</h1>
        <p style={{ color: '#555', fontSize: '14px' }}>Lookup accounts by name or email to manage access and funding.</p>
      </div>

      {/* Migration Tools */}
      <div style={{ marginBottom: '40px', background: 'rgba(59, 130, 246, 0.03)', border: '1px solid rgba(59, 130, 246, 0.1)', borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>Legacy Data Migration</h2>
            <p style={{ fontSize: '13px', color: '#555' }}>Import accounts and transactions from old system SQL files.</p>
          </div>
          <button 
            onClick={startMigration} 
            disabled={migrating}
            style={{ 
              background: migrating ? '#222' : '#3b82f6', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '10px', 
              padding: '12px 24px', 
              fontWeight: '700', 
              fontSize: '14px', 
              cursor: migrating ? 'not-allowed' : 'pointer',
              boxShadow: migrating ? 'none' : '0 4px 14px rgba(59, 130, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
            {migrating ? 'Migrating Data...' : 'Start Data Migration'}
            {migrating && <div className="spinner-small" />}
          </button>
        </div>

        {migrationResult && (
          <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
             {[
               { label: 'New Users', value: migrationResult.migratedUsers, color: '#00c896' },
               { label: 'Skipped (Existing)', value: migrationResult.skippedUsers, color: '#555' },
               { label: 'Transactions', value: migrationResult.migratedTransactions, color: '#3b82f6' },
             ].map(r => (
               <div key={r.label} style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px' }}>
                 <div style={{ fontSize: '10px', color: '#444', textTransform: 'uppercase', fontWeight: '800', marginBottom: '4px' }}>{r.label}</div>
                 <div style={{ fontSize: '18px', fontWeight: '800', color: r.color }}>{r.value}</div>
               </div>
             ))}
          </div>
        )}
      </div>

      <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} onUpdateField={handleToggle} />
      
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        {[
          { label: 'Total Accounts', value: users.length, color: '#3b82f6' },
          { label: 'Active Sessions', value: users.filter(u => u.AccountEnabled === 'true').length, color: '#00c896' },
          { label: 'Disabled Access', value: users.filter(u => u.AccountEnabled !== 'true').length, color: '#ff5555' },
        ].map(s => (
          <div key={s.label} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '800', marginBottom: '6px' }}>{s.label}</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Search Bar Container */}
      <div style={{ position: 'relative', marginBottom: '32px', maxWidth: '480px' }}>
        <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
          <HiSearch size={20} color="#333" />
        </div>
        <input 
          className="input-dark" 
          placeholder="Type an email or name to search..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          style={{ 
            paddingLeft: '48px', 
            height: '54px', 
            fontSize: '16px', 
            borderRadius: '14px',
            background: '#111',
            border: `1px solid ${isSearchActive ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.08)'}`,
            boxShadow: isSearchActive ? '0 0 20px rgba(59, 130, 246, 0.1)' : 'none',
            transition: 'all 0.2s'
          }} 
        />
      </div>

      {/* Results Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '14px' }}>
        {loading ? (
             <div style={{ padding: '40px', textAlign: 'center', color: '#444' }}>Loading accounts...</div>
        ) : !isSearchActive ? (
             <div style={{ gridColumn: '1 / -1', padding: '80px 20px', textAlign: 'center', background: '#111', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                <HiUsers size={48} color="#222" style={{ margin: '0 auto 16px', display: 'block' }} />
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#333' }}>Ready for lookup</h3>
                <p style={{ fontSize: '14px', color: '#222', maxWidth: '280px', margin: '8px auto 0' }}>Search results will appear here as you type.</p>
             </div>
        ) : !filtered.length ? (
             <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', color: '#555', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <HiX size={32} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.2 }} />
                <p style={{ fontWeight: '600' }}>No matching accounts found for "{search}"</p>
             </div>
        ) : (
          filtered.map((user) => {
            const dynamicBalance = calculateCurrentBalance(parseFloat(user.investmentAmount) || 0, user.investmentPlan, user.investmentDate)
            return (
              <div key={user.userID} style={{ 
                 background: '#111', 
                 border: '1px solid rgba(255,255,255,0.06)', 
                 borderRadius: '16px', 
                 padding: '20px 24px',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'space-between',
                 gap: '16px',
                 transition: 'transform 0.2s',
                 cursor: 'pointer'
              }} onClick={() => setSelectedUser(user)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #222, #000)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: '800', flexShrink: 0 }}>
                     {user.FName?.[0]}{user.LName?.[0]}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.FName} {user.LName}</div>
                    <div style={{ fontSize: '12px', color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.Email}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: user.AccountEnabled === 'true' ? '#00c896' : '#ff5555' }}>
                        {user.AccountEnabled === 'true' ? 'Active' : 'Disabled'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#444', fontWeight: '700' }}>
                        ${dynamicBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </div>
                   </div>
                   
                   <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
                      <HiEye size={16} />
                   </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
