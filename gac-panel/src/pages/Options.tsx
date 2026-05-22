import Sidebar from '../components/Sidebar'

const mono = 'DM Mono, monospace'

export default function Options() {
  return (
    <div style={{ minHeight: '100vh', background: '#080c0a', display: 'flex' }}>
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <Sidebar />

      <div style={{ marginLeft: 220, flex: 1, padding: '32px 40px', position: 'relative' }}>
        <div style={{ marginBottom: 32, borderBottom: '1px solid #1f2e22', paddingBottom: 24 }}>
          <p style={{ fontFamily: mono, fontSize: 10, color: '#5a7060', letterSpacing: '0.15em', marginBottom: 4 }}>НАСТРОЙКИ</p>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 700, color: '#e8f0ea', letterSpacing: '-0.02em' }}>Options</h1>
        </div>

        <div style={{ background: '#0c110e', border: '1px solid #1f2e22', padding: '48px', textAlign: 'center' }}>
          <div style={{ fontFamily: mono, fontSize: 11, color: '#3d5040', letterSpacing: '0.12em', marginBottom: 12 }}>
            В РАЗРАБОТКЕ
          </div>
          <p style={{ fontFamily: mono, fontSize: 12, color: '#5a7060' }}>
            Раздел настроек появится в ближайших обновлениях.
          </p>
        </div>
      </div>
    </div>
  )
}