import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/login'); return }

      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (data?.role === 'admin') {
        setAllowed(true)
      } else {
        navigate('/dashboard')
      }
      setLoading(false)
    }
    check()
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#080c0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#5a7060', letterSpacing: '0.12em' }}>
        ПРОВЕРКА ДОСТУПА...
      </span>
    </div>
  )

  if (!allowed) return null

  return <>{children}</>
}