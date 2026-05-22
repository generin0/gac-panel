import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'

const mono = 'DM Mono, monospace'

interface Subscription {
  status: string
  expires_at: string | null
  license_key: string | null
  plan: string
}

export default function Dashboard() {
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
  const maskedKey = sub?.license_key ? sub.license_key.replace(/[^-]/g, '•') : '—'

  return (
    <div style={{ minHeight: '100vh', background: '#080c0a', display: 'flex' }}>
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <Sidebar />

      <div style={{ marginLeft: 220, flex: 1, padding: '32px 40px', position: 'relative' }}>
        <div style={{ marginBottom: 32, borderBottom: '1px solid #1f2e22', paddingBottom: 24 }}>
          <p style={{ fontFamily: mono, fontSize: 10, color: '#5a7060', letterSpacing: '0.15em', marginBottom: 4 }}>ДОБРО ПОЖАЛОВАТЬ</p>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 700, color: '#e8f0ea', letterSpacing: '-0.02em' }}>Inspect</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#1f2e22', border: '1px solid #1f2e22', marginBottom: 24 }}>
          <div style={{ background: '#0c110e', padding: '20px 24px' }}>
            <p style={{ fontFamily: mono, fontSize: 10, color: '#5a7060', letterSpacing: '0.12em', marginBottom: 8 }}>СТАТУС ПОДПИСКИ</p>
            <p style={{ fontFamily: mono, fontSize: 18, fontWeight: 500, color: statusColor }}>
              {sub?.status === 'active' ? 'Активна' : 'Нет подписки'}
            </p>
          </div>
          <div style={{ background: '#0c110e', padding: '20px 24px' }}>
            <p style={{ fontFamily: mono, fontSize: 10, color: '#5a7060', letterSpacing: '0.12em', marginBottom: 8 }}>ОСТАЛОСЬ ДНЕЙ</p>
            <p style={{ fontFamily: mono, fontSize: 18, fontWeight: 500, color: '#e8f0ea' }}>
              {daysLeft !== null ? String(daysLeft) : '—'}
            </p>
          </div>
          <div style={{ background: '#0c110e', padding: '20px 24px' }}>
            <p style={{ fontFamily: mono, fontSize: 10, color: '#5a7060', letterSpacing: '0.12em', marginBottom: 8 }}>ЛИЦЕНЗИОННЫЙ КЛЮЧ</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <p style={{ fontFamily: mono, fontSize: 14, fontWeight: 500, color: '#9ab09e', letterSpacing: '0.06em' }}>
                {sub?.license_key ? (showKey ? sub.license_key : maskedKey) : '—'}
              </p>
              {sub?.license_key && (
                <button
                  onClick={() => setShowKey(v => !v)}
                  style={{ background: 'transparent', border: '1px solid #1f2e22', color: '#5a7060', cursor: 'pointer', padding: '3px 8px', fontFamily: mono, fontSize: 10, letterSpacing: '0.08em', transition: 'all .2s', flexShrink: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#22c55e'; e.currentTarget.style.color = '#22c55e' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1f2e22'; e.currentTarget.style.color = '#5a7060' }}
                >
                  {showKey ? 'СКРЫТЬ' : 'ПОКАЗАТЬ'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ background: '#0c110e', border: '1px solid #1f2e22', padding: '24px' }}>
          <p style={{ fontFamily: mono, fontSize: 10, color: '#22c55e', letterSpacing: '0.15em', marginBottom: 16 }}>— ИНФОРМАЦИЯ ОБ АККАУНТЕ</p>
          {[
            { key: 'Email', val: email || '...' },
            { key: 'Аккаунт создан', val: createdAt || '...' },
            { key: 'Последний вход', val: 'Сегодня' },
            { key: 'Тип подписки', val: sub?.plan ?? 'Нет' },
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