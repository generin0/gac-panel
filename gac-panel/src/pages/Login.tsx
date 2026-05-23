import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const mono = 'DM Mono, monospace'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin() {
    if (!email || !password) return
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Invalid email or password')
      setLoading(false)
      return
    }

    // Check ban
    const { data: profile } = await supabase
      .from('profiles')
      .select('banned')
      .eq('user_id', data.user.id)
      .single()

    if (profile?.banned) {
      await supabase.auth.signOut()
      setError('This account has been blocked')
      setLoading(false)
      return
    }

    navigate('/dashboard')
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    background: '#080c0a',
    border: '1px solid #1f2e22',
    color: '#e8f0ea',
    fontFamily: mono,
    fontSize: 13,
    padding: '10px 14px',
    outline: 'none',
    transition: 'border-color .2s',
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#080c0a' }}>
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <div className="relative w-full max-w-sm px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" stroke="#22c55e" strokeWidth="1.5" fill="rgba(34,197,94,0.06)"/>
              <polygon points="14,7 21,11 21,17 14,21 7,17 7,11" stroke="#22c55e" strokeWidth="1" fill="rgba(34,197,94,0.1)" opacity="0.6"/>
              <circle cx="14" cy="14" r="2.5" fill="#22c55e"/>
            </svg>
            <span style={{ fontFamily: mono, color: '#e8f0ea', fontSize: 18, fontWeight: 700, letterSpacing: '0.04em' }}>
              Genesis <span style={{ color: '#22c55e' }}>AC</span>
            </span>
          </div>
          <p style={{ fontFamily: mono, fontSize: 11, color: '#5a7060', letterSpacing: '0.12em' }}>PERSONAL ACCOUNT</p>
        </div>

        <div style={{ background: '#0c110e', border: '1px solid #1f2e22' }} className="p-8">
          <div style={{ fontFamily: mono, fontSize: 11, color: '#22c55e', letterSpacing: '0.15em', marginBottom: 24 }}>
            — LOGIN
          </div>

          <div className="mb-4">
            <label style={{ fontFamily: mono, fontSize: 10, color: '#5a7060', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@example.com"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#22c55e'}
              onBlur={e => e.target.style.borderColor = '#1f2e22'}
            />
          </div>

          <div className="mb-6">
            <label style={{ fontFamily: mono, fontSize: 10, color: '#5a7060', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#22c55e'}
              onBlur={e => e.target.style.borderColor = '#1f2e22'}
            />
          </div>

          {error && (
            <div style={{ fontFamily: mono, fontSize: 11, color: 'rgba(239,68,68,0.7)', marginBottom: 16, padding: '8px 12px', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' }}>
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%',
              background: 'transparent',
              border: '1px solid #22c55e',
              color: loading ? '#5a7060' : '#22c55e',
              fontFamily: mono,
              fontSize: 12,
              letterSpacing: '0.14em',
              padding: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background .2s, box-shadow .2s',
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.background = 'rgba(34,197,94,0.08)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(34,197,94,0.2)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {loading ? '[ LOADING... ]' : '[ ENTER ]'}
          </button>

          <div className="text-center mt-4">
            <span style={{ fontFamily: mono, fontSize: 11, color: '#5a7060' }}>No account? </span>
            <button
              onClick={() => navigate('/register')}
              style={{ fontFamily: mono, fontSize: 11, color: '#22c55e', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}