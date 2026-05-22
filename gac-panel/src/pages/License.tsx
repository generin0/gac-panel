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

const planDetails: Record<string, {
  name: string
  features: string[]
  color: string
}> = {
  standard: {
    name: 'Standard',
    color: '#22c55e',
    features: [
      'Базовое сканирование процессов',
      'Сигнатурное сканирование',
      'Серверная верификация',
      'Онлайн / Оффлайн режим',
    ],
  },
  medium: {
    name: 'Medium',
    color: '#22c55e',
    features: [
      'Базовое сканирование процессов',
      'Сигнатурное сканирование',
      'Серверная верификация',
      'Онлайн / Оффлайн режим',
      'Поведенческий анализ',
      'Мониторинг целостности памяти',
      'Приоритетная поддержка',
    ],
  },
  advanced: {
    name: 'Advanced',
    color: '#22c55e',
    features: [
      'Базовое сканирование процессов',
      'Сигнатурное сканирование',
      'Серверная верификация',
      'Онлайн / Оффлайн режим',
      'Поведенческий анализ',
      'Мониторинг целостности памяти',
      'Приоритетная поддержка',
      'Kernel Driver защита (скоро)',
      'Расширенная база сигнатур',
      'Прямой доступ к API',
      'Максимальный приоритет поддержки',
    ],
  },
}

export default function License() {
  const [sub, setSub] = useState<Subscription | null>(null)
  const [showKey, setShowKey] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()
      if (data) setSub(data)
      setLoading(false)
    }
    load()
  }, [])

  const daysLeft = sub?.expires_at
    ? Math.max(0, Math.ceil((new Date(sub.expires_at).getTime() - Date.now()) / 86400000) + 1)
    : null

  const plan = sub?.plan ? planDetails[sub.plan] : null
  const maskedKey = sub?.license_key ? sub.license_key.replace(/[^-]/g, '•') : '—'
  const isActive = sub?.status === 'active'

  return (
    <div style={{ minHeight: '100vh', background: '#080c0a', display: 'flex' }}>
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <Sidebar />

      <div style={{ marginLeft: 220, flex: 1, padding: '32px 40px', position: 'relative' }}>

        {/* Хедер */}
        <div style={{ marginBottom: 32, borderBottom: '1px solid #1f2e22', paddingBottom: 24 }}>
          <p style={{ fontFamily: mono, fontSize: 10, color: '#5a7060', letterSpacing: '0.15em', marginBottom: 4 }}>ЛИЦЕНЗИЯ</p>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 700, color: '#e8f0ea', letterSpacing: '-0.02em' }}>License</h1>
        </div>

        {loading ? (
          <div style={{ fontFamily: mono, fontSize: 12, color: '#5a7060' }}>ЗАГРУЗКА...</div>
        ) : !sub || !isActive ? (
          /* Нет подписки */
          <div style={{ background: '#0c110e', border: '1px solid #1f2e22', padding: '48px', textAlign: 'center' }}>
            <div style={{ fontFamily: mono, fontSize: 11, color: '#3d5040', letterSpacing: '0.12em', marginBottom: 16 }}>НЕТ АКТИВНОЙ ЛИЦЕНЗИИ</div>
            <p style={{ fontFamily: mono, fontSize: 12, color: '#5a7060', marginBottom: 24 }}>
              У вас нет активной подписки. Перейдите в раздел Subscription чтобы выбрать тариф.
            </p>
            <div style={{ width: 48, height: 1, background: '#1f2e22', margin: '0 auto' }} />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#1f2e22', border: '1px solid #1f2e22' }}>

            {/* Левая колонка — детали лицензии */}
            <div style={{ background: '#0c110e', padding: '28px 24px' }}>
              <p style={{ fontFamily: mono, fontSize: 10, color: '#22c55e', letterSpacing: '0.15em', marginBottom: 20 }}>— ДЕТАЛИ ЛИЦЕНЗИИ</p>

              {[
                { key: 'Тариф', val: plan?.name ?? sub.plan },
                { key: 'Статус', val: isActive ? 'Активна' : 'Неактивна', color: isActive ? '#22c55e' : '#5a7060' },
                { key: 'Осталось дней', val: daysLeft !== null ? String(daysLeft) : '—' },
                { key: 'Истекает', val: sub.expires_at ? new Date(sub.expires_at).toLocaleDateString('ru-RU') : '—' },
              ].map(row => (
                <div key={row.key} style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1a2618' }}>
                  <span style={{ fontFamily: mono, fontSize: 12, color: '#5a7060', width: 160 }}>{row.key}</span>
                  <span style={{ fontFamily: mono, fontSize: 12, color: (row as any).color ?? '#9ab09e' }}>{row.val}</span>
                </div>
              ))}

              {/* Ключ */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0' }}>
                <span style={{ fontFamily: mono, fontSize: 12, color: '#5a7060', width: 160 }}>Лицензионный ключ</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: mono, fontSize: 12, color: '#9ab09e', letterSpacing: '0.04em' }}>
                    {showKey ? sub.license_key : maskedKey}
                  </span>
                  <button
                    onClick={() => setShowKey(v => !v)}
                    style={{
                      background: 'transparent', border: '1px solid #1f2e22', color: '#5a7060',
                      cursor: 'pointer', padding: '3px 8px', fontFamily: mono, fontSize: 10,
                      letterSpacing: '0.08em', transition: 'all .2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#22c55e'; e.currentTarget.style.color = '#22c55e' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#1f2e22'; e.currentTarget.style.color = '#5a7060' }}
                  >
                    {showKey ? 'СКРЫТЬ' : 'ПОКАЗАТЬ'}
                  </button>
                </div>
              </div>
            </div>

            {/* Правая колонка — включённые функции */}
            <div style={{ background: '#0c110e', padding: '28px 24px' }}>
              <p style={{ fontFamily: mono, fontSize: 10, color: '#22c55e', letterSpacing: '0.15em', marginBottom: 20 }}>— ВКЛЮЧЕНО В ТАРИФ</p>
              {plan?.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 5, height: 5, background: '#22c55e', borderRadius: '50%', marginTop: 6, flexShrink: 0 }} />
                  <span style={{ fontFamily: mono, fontSize: 12, color: '#9ab09e', lineHeight: 1.6 }}>{f}</span>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  )
}