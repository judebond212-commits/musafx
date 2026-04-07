'use client'
import { useState } from 'react'
import { HiExternalLink, HiX } from 'react-icons/hi'

export default function ImageModal({ src }) {
  const [open, setOpen] = useState(false)

  if (!src) return <span style={{ color: '#333', fontSize: '12px' }}>—</span>

  return (
    <>
      <button onClick={() => setOpen(true)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#3b82f6', fontSize: '12px', fontWeight: '500', fontFamily: 'var(--font-body)', padding: 0 }}>
        View <HiExternalLink size={12} />
      </button>

      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backdropFilter: 'blur(4px)' }} onClick={() => setOpen(false)}>
          <div style={{ position: 'relative', maxWidth: '600px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} style={{ position: 'absolute', top: '-40px', right: '0px', background: 'none', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold' }}>
              <HiX size={20} /> Close
            </button>
            <img src={src} alt="Screenshot" style={{ maxWidth: '100%', maxHeight: 'calc(90vh - 40px)', borderRadius: '8px', objectFit: 'contain', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)' }} />
          </div>
        </div>
      )}
    </>
  )
}
