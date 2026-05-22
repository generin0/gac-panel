import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const mono = 'DM Mono, monospace'

interface Subscription {
  status: string
  expires_at: string | null
  license_key: string | null
  plan: string
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [createdAt, setCreatedAt] = useState('')
  const [sub, setSub] = useState<Subscription | null>(null)
  const [showKey, setShowKey] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email ?? '')
      setCreatedAt(new Date(user.created_at).toLocaleDateString('ru-RU'))
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()
      if (data) setSub(data)
    }
    load()
  }, [])

  const daysLeft = sub?.expires_at
    ? Math.max(0, Math.ceil((new Date(sub.expires_at).getTime() - Date.now()) / 86400000) + 1)
    : null

  const statusColor = sub?.status === 'active' ? '#22c55e' : '#5a7060'

  const maskedKey = sub?.license_key
    ? sub.license_key.replace(/[^-]/g, '•')
    : '—'

  return (
    <div style={{ minHeight: '100vh', background: '#080c0a', display: 'flex' }}>
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Сайдбар */}
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
          {[
            { label: 'Inspect', active: true },
            { label: 'Subscription', active: false },
            { label: 'License', active: false },
            { label: 'Options', active: false },
          ].map(item => (
            <div
              key={item.label}
              style={{
                padding: '10px 20px', fontFamily: mono, fontSize: 12, letterSpacing: '0.06em',
                color: item.active ? '#22c55e' : '#5a7060',
                background: item.active ? 'rgba(34,197,94,0.06)' : 'transparent',
                borderLeft: item.active ? '2px solid #22c55e' : '2px solid transparent',
                cursor: 'pointer', transition: 'all .2s',
              }}
              onMouseEnter={e => { if (!item.active) e.currentTarget.style.color = '#9ab09e' }}
              onMouseLeave={e => { if (!item.active) e.currentTarget.style.color = '#5a7060' }}
            >
              {item.label}
            </div>
          ))}
        </nav>

        {/* Кнопки внизу */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #1f2e22', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              width: '100%', background: 'transparent', border: '1px solid #1f2e22',
              color: '#5a7060', fontFamily: mono, fontSize: 11,
              letterSpacing: '0.1em', padding: '8px', cursor: 'pointer', transition: 'all .2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#22c55e'
              e.currentTarget.style.color = '#22c55e'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#1f2e22'
              e.currentTarget.style.color = '#5a7060'
            }}
          >
            [ MAIN PAGE ]
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              navigate('/login')
            }}
            style={{
              width: '100%', background: 'transparent', border: '1px solid #1f2e22',
              color: '#5a7060', fontFamily: mono, fontSize: 11,
              letterSpacing: '0.1em', padding: '8px', cursor: 'pointer', transition: 'all .2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'
              e.currentTarget.style.color = 'rgba(239,68,68,0.7)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#1f2e22'
              e.currentTarget.style.color = '#5a7060'
            }}
          >
            [ EXIT ACCOUNT ]
          </button>
        </div>
      </div>

      {/* Контент */}
      <div style={{ marginLeft: 220, flex: 1, padding: '32px 40px', position: 'relative' }}>
        <div style={{ marginBottom: 32, borderBottom: '1px solid #1f2e22', paddingBottom: 24 }}>
          <p style={{ fontFamily: mono, fontSize: 10, color: '#5a7060', letterSpacing: '0.15em', marginBottom: 4 }}>WELCOME</p>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 700, color: '#e8f0ea', letterSpacing: '-0.02em' }}>PRIVATE ACCOUNT</h1>
        </div>

        {/* Карточки */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#1f2e22', border: '1px solid #1f2e22', marginBottom: 24 }}>
          <div style={{ background: '#0c110e', padding: '20px 24px' }}>
            <p style={{ fontFamily: mono, fontSize: 10, color: '#5a7060', letterSpacing: '0.12em', marginBottom: 8 }}>SUBSCRIPTION STATUS</p>
            <p style={{ fontFamily: mono, fontSize: 18, fontWeight: 500, color: statusColor }}>
              {sub?.status === 'active' ? 'Активна' : 'Нет подписки'}
            </p>
          </div>
          <div style={{ background: '#0c110e', padding: '20px 24px' }}>
            <p style={{ fontFamily: mono, fontSize: 10, color: '#5a7060', letterSpacing: '0.12em', marginBottom: 8 }}>DAYS LEFT</p>
            <p style={{ fontFamily: mono, fontSize: 18, fontWeight: 500, color: '#e8f0ea' }}>
              {daysLeft !== null ? String(daysLeft) : '—'}
            </p>
          </div>
          <div style={{ background: '#0c110e', padding: '20px 24px' }}>
            <p style={{ fontFamily: mono, fontSize: 10, color: '#5a7060', letterSpacing: '0.12em', marginBottom: 8 }}>LICENSE KEY</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <p style={{ fontFamily: mono, fontSize: 14, fontWeight: 500, color: '#9ab09e', letterSpacing: '0.06em' }}>
                {sub?.license_key ? (showKey ? sub.license_key : maskedKey) : '—'}
              </p>
              {sub?.license_key && (
                <button
                  onClick={() => setShowKey(v => !v)}
                  style={{
                    background: 'transparent', border: '1px solid #1f2e22', color: '#5a7060',
                    cursor: 'pointer', padding: '3px 8px', fontFamily: mono, fontSize: 10,
                    letterSpacing: '0.08em', transition: 'all .2s', flexShrink: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#22c55e'; e.currentTarget.style.color = '#22c55e' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1f2e22'; e.currentTarget.style.color = '#5a7060' }}
                >
                  {showKey ? 'HIDE' : 'SHOW'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Информация */}
        <div style={{ background: '#0c110e', border: '1px solid #1f2e22', padding: '24px' }}>
          <p style={{ fontFamily: mono, fontSize: 10, color: '#22c55e', letterSpacing: '0.15em', marginBottom: 16 }}>— ACCOUNT INFORMATION</p>
          {[
            { key: 'Email', val: email || '...' },
            { key: 'Account created', val: createdAt || '...' },
            { key: 'Last seen', val: 'Today' },
            { key: 'Subscription', val: sub?.plan ?? 'No' },
          ].map(row => (
            <div key={row.key} style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1a2618' }}>
              <span style={{ fontFamily: mono, fontSize: 12, color: '#5a7060', width: 180 }}>{row.key}</span>
              <span style={{ fontFamily: mono, fontSize: 12, color: '#9ab09e' }}>{row.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}