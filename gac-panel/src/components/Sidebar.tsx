import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const mono = 'DM Mono, monospace'

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const links = [
    { label: 'Inspect', path: '/dashboard' },
    { label: 'Subscription', path: '/dashboard/subscription' },
    { label: 'License', path: '/dashboard/license' },
    { label: 'Options', path: '/dashboard/options' },
  ]

  return (
    <div style={{ width: 220, background: '#0c110e', borderRight: '1px solid #1f2e22', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, zIndex: 10 }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #1f2e22' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
            <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" stroke="#22c55e" strokeWidth="1.5" fill="rgba(34,197,94,0.06)"/>
            <polygon points="14,7 21,11 21,17 14,21 7,17 7,11" stroke="#22c55e" strokeWidth="1" fill="rgba(34,197,94,0.1)" opacity="0.6"/>
            <circle cx="14" cy="14" r="2.5" fill="#22c55e"/>
          </svg>
          <span style={{ fontFamily: mono, color: '#e8f0ea', fontSize: 14, fontWeight: 700, letterSpacing: '0.04em' }}>
            Genesis <span style={{ color: '#22c55e' }}>AC</span>
          </span>
        </div>
      </div>

      <nav style={{ padding: '16px 0', flex: 1 }}>
        {links.map(item => {
          const active = location.pathname === item.path
          return (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                padding: '10px 20px', fontFamily: mono, fontSize: 12,
                letterSpacing: '0.06em',
                color: active ? '#22c55e' : '#5a7060',
                background: active ? 'rgba(34,197,94,0.06)' : 'transparent',
                borderLeft: active ? '2px solid #22c55e' : '2px solid transparent',
                cursor: 'pointer', transition: 'all .2s',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#9ab09e' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#5a7060' }}
            >
              {item.label}
            </div>
          )
        })}
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid #1f2e22', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          onClick={() => navigate('/')}
          style={{
            width: '100%', background: 'transparent', border: '1px solid #1f2e22',
            color: '#5a7060', fontFamily: mono, fontSize: 11,
            letterSpacing: '0.1em', padding: '8px', cursor: 'pointer', transition: 'all .2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#22c55e'; e.currentTarget.style.color = '#22c55e' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#1f2e22'; e.currentTarget.style.color = '#5a7060' }}
        >
          [ ГЛАВНАЯ ]
        </button>
        <button
          onClick={async () => { await supabase.auth.signOut(); navigate('/login') }}
          style={{
            width: '100%', background: 'transparent', border: '1px solid #1f2e22',
            color: '#5a7060', fontFamily: mono, fontSize: 11,
            letterSpacing: '0.1em', padding: '8px', cursor: 'pointer', transition: 'all .2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; e.currentTarget.style.color = 'rgba(239,68,68,0.7)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#1f2e22'; e.currentTarget.style.color = '#5a7060' }}
        >
          [ ВЫЙТИ ]
        </button>
      </div>
    </div>
  )
}