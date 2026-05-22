import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const mono = 'DM Mono, monospace'

interface User {
  id: string
  email: string
  created_at: string
  subscription: {
    status: string
    expires_at: string | null
    license_key: string | null
    plan: string
  } | null
}

export default function Admin() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadUsers() {
    setLoading(true)

    const { data, error } = await supabase.rpc('get_all_users')

    if (error || !data) { setLoading(false); return }

    const { data: subs } = await supabase
      .from('subscriptions')
      .select('*')

    const mapped: User[] = data.map((u: any) => ({
      id: u.user_id,
      email: u.email,
      created_at: u.created_at,
      subscription: subs?.find(s => s.user_id === u.user_id) ?? null,
    }))

    setUsers(mapped)
    setLoading(false)
  }

  useEffect(() => { loadUsers() }, [])

async function toggleBan(userId: string, currentStatus: string) {
  console.log('toggleBan called', userId, currentStatus)
  
  const isBanned = currentStatus === 'banned'
  
  const { error } = await supabase
    .from('profiles')
    .update({ banned: !isBanned })
    .eq('user_id', userId)

  console.log('update error:', error)

  await supabase
    .from('subscriptions')
    .update({ status: isBanned ? 'active' : 'banned' })
    .eq('user_id', userId)

  loadUsers()
}

  async function giveSubscription(userId: string) {
    const expires = new Date()
    expires.setDate(expires.getDate() + 30)
    const key = 'GAC-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()

    const existing = users.find(u => u.id === userId)?.subscription

    if (existing) {
      await supabase
        .from('subscriptions')
        .update({ status: 'active', expires_at: expires.toISOString(), license_key: key, plan: 'standard' })
        .eq('user_id', userId)
    } else {
      await supabase
        .from('subscriptions')
        .insert({ user_id: userId, status: 'active', expires_at: expires.toISOString(), license_key: key, plan: 'standard' })
    }
    loadUsers()
  }

  const filtered = users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()))

  const stats = [
    { label: 'ALL USERS', value: users.length },
    { label: 'ACTIVE USERS', value: users.filter(u => u.subscription?.status === 'active').length },
    { label: 'BANNED', value: users.filter(u => u.subscription?.status === 'banned').length },
  ]

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
            <span style={{ fontFamily: mono, color: '#e8f0ea', fontSize: 14, fontWeight: 700 }}>
              Genesis <span style={{ color: '#22c55e' }}>AC</span>
            </span>
          </div>
          <p style={{ fontFamily: mono, fontSize: 9, color: 'rgba(239,68,68,0.6)', letterSpacing: '0.15em', marginTop: 6 }}>
            ADMIN PANEL
          </p>
        </div>

        <nav style={{ padding: '16px 0', flex: 1 }}>
          {[
            { label: 'Users', active: true },
            { label: 'Subscriptions', active: false },
            { label: 'Statistics', active: false },
            { label: 'Options', active: false },
          ].map(item => (
            <div key={item.label} style={{
              padding: '10px 20px', fontFamily: mono, fontSize: 12, letterSpacing: '0.06em',
              color: item.active ? '#22c55e' : '#5a7060',
              background: item.active ? 'rgba(34,197,94,0.06)' : 'transparent',
              borderLeft: item.active ? '2px solid #22c55e' : '2px solid transparent',
              cursor: 'pointer',
            }}>
              {item.label}
            </div>
          ))}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid #1f2e22' }}>
          <button
            onClick={async () => { await supabase.auth.signOut(); navigate('/login') }}
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
            [ ВЫЙТИ ]
          </button>
        </div>
      </div>

      {/* Контент */}
      <div style={{ marginLeft: 220, flex: 1, padding: '32px 40px', position: 'relative' }}>

        <div style={{ marginBottom: 32, borderBottom: '1px solid #1f2e22', paddingBottom: 24 }}>
          <p style={{ fontFamily: mono, fontSize: 10, color: 'rgba(239,68,68,0.5)', letterSpacing: '0.15em', marginBottom: 4 }}>
            АДМИНИСТРАТИВНАЯ ПАНЕЛЬ
          </p>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 700, color: '#e8f0ea', letterSpacing: '-0.02em' }}>
            Управление
          </h1>
        </div>

        {/* Статистика */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#1f2e22', border: '1px solid #1f2e22', marginBottom: 24 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: '#0c110e', padding: '20px 24px' }}>
              <p style={{ fontFamily: mono, fontSize: 10, color: '#5a7060', letterSpacing: '0.12em', marginBottom: 8 }}>{s.label}</p>
              <p style={{ fontFamily: mono, fontSize: 24, fontWeight: 500, color: '#22c55e' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Поиск */}
        <div style={{ marginBottom: 16 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for email or ID..."
            style={{
              width: 320, background: '#0c110e', border: '1px solid #1f2e22',
              color: '#e8f0ea', fontFamily: mono, fontSize: 12,
              padding: '8px 14px', outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = '#22c55e'}
            onBlur={e => e.target.style.borderColor = '#1f2e22'}
          />
        </div>

        {/* Таблица */}
        <div style={{ background: '#0c110e', border: '1px solid #1f2e22' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '12px 20px', borderBottom: '1px solid #1f2e22' }}>
            {['USER', 'STATUS', 'PLAN', 'EXPIRE', 'ACTIONS'].map(h => (
              <span key={h} style={{ fontFamily: mono, fontSize: 10, color: '#5a7060', letterSpacing: '0.12em' }}>{h}</span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center', fontFamily: mono, fontSize: 12, color: '#3d4f40' }}>
              ЗАГРУЗКА...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', fontFamily: mono, fontSize: 12, color: '#3d4f40' }}>
              Пользователи не найдены
            </div>
          ) : filtered.map(user => {
            const status = user.subscription?.status ?? 'none'
            const expires = user.subscription?.expires_at
              ? new Date(user.subscription.expires_at).toLocaleDateString('ru-RU')
              : '—'

            return (
              <div
                key={user.id}
                style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                  padding: '14px 20px', borderBottom: '1px solid #1a2618',
                  transition: 'background .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontFamily: mono, fontSize: 11, color: '#9ab09e', wordBreak: 'break-all' }}>{user.email}</span>
                <span style={{
                  fontFamily: mono, fontSize: 11,
                  color: status === 'active' ? '#22c55e' : status === 'banned' ? 'rgba(239,68,68,0.7)' : '#5a7060',
                }}>
                  {status === 'active' ? 'ACTIVE' : status === 'banned' ? 'BANNED' : 'NONE'}
                </span>
                <span style={{ fontFamily: mono, fontSize: 11, color: '#5a7060' }}>
                  {user.subscription?.plan ?? '—'}
                </span>
                <span style={{ fontFamily: mono, fontSize: 11, color: '#5a7060' }}>{expires}</span>

                <div style={{ display: 'flex', gap: 6 }}>
                  {/* Выдать подписку */}
                  <button
                    onClick={() => giveSubscription(user.id)}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(34,197,94,0.3)',
                      color: 'rgba(34,197,94,0.7)',
                      fontFamily: mono, fontSize: 9, letterSpacing: '0.06em',
                      padding: '3px 8px', cursor: 'pointer', transition: 'all .2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    title="Give sub for 30 days"
                  >
                    +SUB
                  </button>

                  {/* BAN / UNBAN */}
                  {user.subscription && (
                    <button
                      onClick={() => toggleBan(user.id, status)}
                      style={{
                        background: 'transparent',
                        border: `1px solid ${status === 'banned' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                        color: status === 'banned' ? 'rgba(34,197,94,0.7)' : 'rgba(239,68,68,0.7)',
                        fontFamily: mono, fontSize: 9, letterSpacing: '0.06em',
                        padding: '3px 8px', cursor: 'pointer', transition: 'all .2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      {status === 'banned' ? 'UNBAN' : 'BAN'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}