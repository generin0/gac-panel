import Sidebar from '../components/Sidebar'

const mono = 'DM Mono, monospace'

const plans = [
  {
    id: 'standard',
    name: 'Standard',
    price: '$5',
    period: '/mo',
    color: '#22c55e',
    features: [
      'Базовое сканирование процессов',
      'Сигнатурное сканирование',
      'Серверная верификация',
      'Онлайн / Оффлайн режим',
    ],
    highlight: false,
  },
  {
    id: 'medium',
    name: 'Medium',
    price: '$10',
    period: '/mo',
    color: '#22c55e',
    features: [
      'Всё из Standard',
      'Поведенческий анализ',
      'Мониторинг целостности памяти',
      'Приоритетная поддержка',
    ],
    highlight: true,
  },
  {
    id: 'advanced',
    name: 'Advanced',
    price: '$20',
    period: '/mo',
    color: '#22c55e',
    features: [
      'Всё из Medium',
      'Kernel Driver защита (скоро)',
      'Расширенная база сигнатур',
      'Прямой доступ к API',
      'Максимальный приоритет поддержки',
    ],
    highlight: false,
  },
]

export default function Subscription() {
  return (
    <div style={{ minHeight: '100vh', background: '#080c0a', display: 'flex' }}>
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <Sidebar />

      <div style={{ marginLeft: 220, flex: 1, padding: '32px 40px', position: 'relative' }}>

        {/* Хедер */}
        <div style={{ marginBottom: 48, borderBottom: '1px solid #1f2e22', paddingBottom: 24 }}>
          <p style={{ fontFamily: mono, fontSize: 10, color: '#5a7060', letterSpacing: '0.15em', marginBottom: 4 }}>ТАРИФЫ</p>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 700, color: '#e8f0ea', letterSpacing: '-0.02em' }}>Subscription</h1>
        </div>

        {/* Карточки тарифов */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#1f2e22', border: '1px solid #1f2e22' }}>
          {plans.map(plan => (
            <div
              key={plan.id}
              style={{
                background: plan.highlight ? '#0e1a10' : '#0c110e',
                padding: '32px 28px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Popular badge */}
              {plan.highlight && (
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  fontFamily: mono, fontSize: 9, letterSpacing: '0.12em',
                  color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)',
                  padding: '3px 8px', background: 'rgba(34,197,94,0.06)',
                }}>
                  POPULAR
                </div>
              )}

              {/* Название */}
              <div style={{ fontFamily: mono, fontSize: 10, color: '#5a7060', letterSpacing: '0.15em', marginBottom: 12 }}>
                {plan.name.toUpperCase()}
              </div>

              {/* Цена */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 28 }}>
                <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 40, fontWeight: 800, color: '#e8f0ea', lineHeight: 1 }}>
                  {plan.price}
                </span>
                <span style={{ fontFamily: mono, fontSize: 12, color: '#5a7060' }}>{plan.period}</span>
              </div>

              {/* Разделитель */}
              <div style={{ height: 1, background: '#1f2e22', marginBottom: 24 }} />

              {/* Фичи */}
              <div style={{ flex: 1, marginBottom: 28 }}>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 5, height: 5, background: '#22c55e', borderRadius: '50%', marginTop: 6, flexShrink: 0 }} />
                    <span style={{ fontFamily: mono, fontSize: 12, color: '#9ab09e', lineHeight: 1.6 }}>{f}</span>
                  </div>
                ))}
              </div>

              {/* Кнопка */}
              <button
                style={{
                  width: '100%', background: 'transparent',
                  border: `1px solid ${plan.highlight ? '#22c55e' : 'rgba(34,197,94,0.3)'}`,
                  color: plan.highlight ? '#22c55e' : '#5a7060',
                  fontFamily: mono, fontSize: 11, letterSpacing: '0.12em',
                  padding: '11px', cursor: 'not-allowed',
                  opacity: 0.6, transition: 'all .2s',
                }}
                disabled
                title="Скоро"
              >
                [ СКОРО ]
              </button>

            </div>
          ))}
        </div>

        {/* Заметка */}
        <div style={{ marginTop: 24, padding: '16px 20px', border: '1px solid #1f2e22', background: '#0c110e' }}>
          <p style={{ fontFamily: mono, fontSize: 11, color: '#3d5040', letterSpacing: '0.06em' }}>
            — Покупка подписок будет доступна в ближайшее время. Следите за обновлениями в нашем <a href="https://discord.gg/4cmNcDk37X" target="_blank" style={{ color: '#5a7060', textDecoration: 'none' }}>Discord</a>.
          </p>
        </div>

      </div>
    </div>
  )
}