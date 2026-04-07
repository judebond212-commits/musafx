
'use client'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { HiClipboardList, HiSearch, HiExternalLink, HiCheck, HiX } from 'react-icons/hi'

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [toggling, setToggling] = useState({})

  useEffect(() => { fetchTransactions() }, [])

  async function fetchTransactions() {
    try {
      const res = await fetch('/api/admin/transactions')
      const data = await res.json()
      if (data.transactions) setTransactions(data.transactions)
    } catch { toast.error('Failed to load transactions.') }
    finally { setLoading(false) }
  }

  async function handleToggleConfirmed(tx) {
    setToggling(prev => ({ ...prev, [tx.id]: true }))
    const newVal = tx.confirmed === 'true' ? 'false' : 'true'
    try {
      const res = await fetch('/api/admin/transactions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tx.id, confirmed: newVal }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTransactions(prev => prev.map(t => t.id === tx.id ? { ...t, confirmed: newVal } : t))
      toast.success(`Transaction ${newVal === 'true' ? 'confirmed' : 'unconfirmed'}.`)
    } catch (err) { toast.error(err.message) }
    finally { setToggling(prev => ({ ...prev, [tx.id]: false })) }
  }

  const filtered = transactions.filter(tx => {
    const matchesSearch = !search ||
      tx.email?.toLowerCase().includes(search.toLowerCase()) ||
      tx.paymentfor?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter =
      filter === 'all' ||
      (filter === 'pending' && tx.confirmed !== 'true') ||
      (filter === 'confirmed' && tx.confirmed === 'true') ||
      (filter === 'investment' && tx.paymentfor === 'investment') ||
      (filter === 'withdrawal' && tx.paymentfor === 'withdrawal')
    return matchesSearch && matchesFilter
  })

  const totalConfirmed = transactions.filter(t => t.confirmed === 'true').length
  const totalPending = transactions.filter(t => t.confirmed !== 'true').length
  const totalVolume = transactions.reduce((s, t) => s + (t.amount || 0), 0)

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: '700', marginBottom: '6px' }}>Transactions</h1>
        <p style={{ color: '#555', fontSize: '14px' }}>Review and confirm all user transactions.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Total Volume', value: `$${totalVolume.toLocaleString()}`, color: '#3b82f6' },
          { label: 'Total Txns', value: transactions.length, color: '#aaa' },
          { label: 'Confirmed', value: totalConfirmed, color: '#00c896' },
          { label: 'Pending', value: totalPending, color: '#60a5fa' },
        ].map(s => (
          <div key={s.label} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '16px' }}>
            <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600', marginBottom: '4px' }}>{s.label}</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '18px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '300px' }}>
          <HiSearch size={15} color="#555" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input className="input-dark" placeholder="Search email or type..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '34px' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { val: 'all', label: 'All' },
            { val: 'pending', label: 'Pending' },
            { val: 'confirmed', label: 'Confirmed' },
            { val: 'investment', label: 'Investments' },
            { val: 'withdrawal', label: 'Withdrawals' },
          ].map(f => (
            <button key={f.val} onClick={() => setFilter(f.val)}
              style={{
                padding: '7px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-body)', border: 'none',
                background: filter === f.val ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.05)',
                color: filter === f.val ? '#3b82f6' : '#666',
                transition: 'all 0.15s',
              }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#444', fontSize: '14px' }}>Loading transactions...</div>
        ) : !filtered.length ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#444' }}>
            <HiClipboardList size={36} style={{ margin: '0 auto 10px', display: 'block', opacity: 0.2 }} />
            <p style={{ fontSize: '14px' }}>No transactions found.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '860px' }}>
              <thead>
                <tr style={{ background: '#0d0d0d', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['#', 'Email', 'Type', 'Date', 'Amount', 'Method', 'Screenshot', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 14px', color: '#555', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx, i) => (
                  <tr key={tx.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <td style={{ padding: '13px 14px', color: '#444', fontSize: '12px' }}>{tx.id}</td>
                    <td style={{ padding: '13px 14px', color: '#888', fontSize: '12px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.email}</td>
                    <td style={{ padding: '13px 14px' }}>
                      <span style={{ padding: '3px 9px', borderRadius: '100px', fontSize: '11px', fontWeight: '600', textTransform: 'capitalize', background: tx.paymentfor === 'investment' ? 'rgba(0,200,150,0.1)' : 'rgba(59, 130, 246, 0.1)', color: tx.paymentfor === 'investment' ? '#00c896' : '#3b82f6' }}>
                        {tx.paymentfor}
                      </span>
                    </td>
                    <td style={{ padding: '13px 14px', color: '#777', whiteSpace: 'nowrap', fontSize: '12px' }}>
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-GB') : '—'}
                    </td>
                    <td style={{ padding: '13px 14px', fontWeight: '700' }}>${tx.amount?.toLocaleString()}</td>
                    <td style={{ padding: '13px 14px', color: '#777', whiteSpace: 'nowrap', fontSize: '12px' }}>{tx.paymentMethod}</td>
                    <td style={{ padding: '13px 14px' }}>
                      {tx.paymentfor === 'investment' && tx.screenshot ? (
                        <a href={tx.screenshot} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#3b82f6', fontSize: '12px', textDecoration: 'none' }}>
                          View <HiExternalLink size={11} />
                        </a>
                      ) : tx.paymentfor === 'withdrawal' ? (
                        <span style={{ color: '#555', fontSize: '11px', maxWidth: '100px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={tx.screenshot}>{tx.screenshot}</span>
                      ) : (
                        <span style={{ color: '#333', fontSize: '12px' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '13px 14px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '600', background: tx.confirmed === 'true' ? 'rgba(0,200,150,0.1)' : 'rgba(96, 165, 250, 0.1)', color: tx.confirmed === 'true' ? '#00c896' : '#60a5fa', border: `1px solid ${tx.confirmed === 'true' ? 'rgba(0,200,150,0.25)' : 'rgba(96, 165, 250, 0.25)'}` }}>
                        {tx.confirmed === 'true' ? 'Confirmed' : 'Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '13px 14px' }}>
                      <button
                        onClick={() => handleToggleConfirmed(tx)}
                        disabled={!!toggling[tx.id]}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', border: 'none',
                          fontFamily: 'var(--font-body)', fontWeight: '600',
                          background: tx.confirmed === 'true' ? 'rgba(255,85,85,0.1)' : 'rgba(0,200,150,0.12)',
                          color: tx.confirmed === 'true' ? '#ff5555' : '#00c896',
                          opacity: toggling[tx.id] ? 0.5 : 1,
                          transition: 'all 0.15s',
                        }}>
                        {toggling[tx.id] ? '...' : tx.confirmed === 'true' ? <><HiX size={12} /> Unconfirm</> : <><HiCheck size={12} /> Confirm</>}
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

