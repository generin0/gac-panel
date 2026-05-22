import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [gacGame, setGacGame] = useState('---')
  const [gacPid, setGacPid] = useState('---')
  const [gacStatus, setGacStatus] = useState('Idle')
  const [gacStatusColor, setGacStatusColor] = useState('')
  const [gacStatusClass, setGacStatusClass] = useState('idle')
  const [gacGameClass, setGacGameClass] = useState('idle')
  const [gacPidClass, setGacPidClass] = useState('idle')
  const [dotAc, setDotAc] = useState('offline')
  const [dotDll, setDotDll] = useState('offline')
  const [dotSrv, setDotSrv] = useState('offline')
  const [stAc, setStAc] = useState('OFFLINE')
  const [stDll, setStDll] = useState('OFFLINE')
  const [stSrv, setStSrv] = useState('OFFLINE')
  const [btnText, setBtnText] = useState('[ LAUNCH GAME ]')
  const [btnColor, setBtnColor] = useState('')
  const [launched, setLaunched] = useState(false)
  const barsAnimated = useRef(false)

  useEffect(() => {
    // Проверяем сессию
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) setUserEmail(session.user.email)
    })

    // Scroll reveal
    const reveals = document.querySelectorAll('.h-reveal')
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) }
      })
    }, { threshold: 0.12 })
    reveals.forEach(el => io.observe(el))

    // Status bars
    const bars = document.querySelectorAll('.h-status-bar-fill') as NodeListOf<HTMLElement>
    const barIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !barsAnimated.current) {
          const el = e.target as HTMLElement
          const w = el.style.width
          el.style.width = '0%'
          setTimeout(() => { el.style.width = w }, 100)
          barIO.unobserve(el)
        }
      })
    }, { threshold: 0.5 })
    bars.forEach(b => barIO.observe(b))

    return () => { io.disconnect(); barIO.disconnect() }
  }, [])

  function gacLaunch() {
    if (launched) return
    setLaunched(true)
    setBtnText('[ LAUNCHING... ]')
    setBtnColor('#f59e0b')
    setTimeout(() => { setGacStatus('Loading...'); setGacStatusColor('#f59e0b'); setGacStatusClass('') }, 400)
    setTimeout(() => { setDotAc('online'); setStAc('ONLINE') }, 900)
    setTimeout(() => { setDotDll('online'); setStDll('ONLINE') }, 1300)
    setTimeout(() => { setDotSrv('online'); setStSrv('ONLINE') }, 1700)
    setTimeout(() => {
      setGacGame('game.exe'); setGacGameClass('active')
      setGacPid('7842'); setGacPidClass('active')
      setGacStatus('Protected'); setGacStatusColor(''); setGacStatusClass('active')
      setBtnText('[ GAME RUNNING ]'); setBtnColor('var(--green)')
    }, 2100)
    setTimeout(() => {
      setBtnText('[ LAUNCH GAME ]'); setBtnColor(''); setLaunched(false)
      setDotAc('offline'); setDotDll('offline'); setDotSrv('offline')
      setStAc('OFFLINE'); setStDll('OFFLINE'); setStSrv('OFFLINE')
      setGacGame('---'); setGacGameClass('idle')
      setGacPid('---'); setGacPidClass('idle')
      setGacStatus('Idle'); setGacStatusColor(''); setGacStatusClass('idle')
    }, 6000)
  }

  return (
    <div className="home-wrap">
      <div id="cursor" style={{ display: 'none' }} />
      <div id="cursor-ring" style={{ display: 'none' }} />

      {/* NAV */}
      <nav className="h-nav">
        <a href="#" className="h-nav-logo">
          <div style={{ width: 28, height: 28 }}>
            <svg viewBox="0 0 28 28" fill="none">
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" stroke="#22c55e" strokeWidth="1.5" fill="rgba(34,197,94,0.06)"/>
              <polygon points="14,7 21,11 21,17 14,21 7,17 7,11" stroke="#22c55e" strokeWidth="1" fill="rgba(34,197,94,0.1)" opacity="0.6"/>
              <circle cx="14" cy="14" r="2.5" fill="#22c55e"/>
            </svg>
          </div>
          <span className="h-nav-logo-text">Genesis <span>AC</span></span>
        </a>

        <ul className="h-nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#architecture">Architecture</a></li>
          <li><a href="#status">Status</a></li>
          <li><a href="#how">How It Works</a></li>
        </ul>

        <div className="h-nav-actions">
          {userEmail ? (
            <button
              className="h-nav-cta"
              onClick={() => navigate('/dashboard')}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="4" r="2.5" stroke="#22c55e" strokeWidth="1"/>
                <path d="M1 11c0-2.76 2.24-4 5-4s5 1.24 5 4" stroke="#22c55e" strokeWidth="1" strokeLinecap="round"/>
              </svg>
              {userEmail.length > 22 ? userEmail.slice(0, 22) + '...' : userEmail}
            </button>
          ) : (
            <>
              <button className="h-nav-login" onClick={() => navigate('/login')}>LOGIN</button>
              <a href="https://discord.gg/4cmNcDk37X" target="_blank" className="h-nav-cta">CONTACT</a>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="h-hero">
        <div className="h-hero-grid" />
        <div className="h-hero-orb" />
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', position: 'relative', zIndex: 2 }}>
          
          {/* Левая часть */}
          <div className="h-hero-content" style={{ maxWidth: 600 }}>
            <div className="h-hero-tag">KERNEL-LEVEL ANTI-CHEAT SYSTEM</div>
            <h1 className="h-hero-title">
              <span className="line1">Genesis</span>
              <span className="line2" data-text="AntiCheat">AntiCheat</span>
            </h1>
            <p className="h-hero-desc">
              Driver-level anti-cheat with server infrastructure. Operates at the kernel level, launches alongside the client, controls the process at every layer.
            </p>
            <div className="h-hero-actions">
              <button className="h-btn-primary" onClick={() => navigate(userEmail ? '/dashboard' : '/login')}>
                {userEmail ? 'MY DASHBOARD' : 'GET STARTED'}
              </button>
              <button className="h-btn-secondary" onClick={() => document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' })}>
                Architecture
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Правая часть — GAC окно */}
          <div style={{ opacity: 0, animation: 'fade-up .8s .8s forwards', position: 'relative', top: '-40px', right: '200px' }}>
            <div className="h-gac-window">
              <div className="h-gac-titlebar">
                <span className="h-gac-name">GAC</span>
                <span className="h-gac-version">v1.0</span>
                <div className="h-gac-close">✕</div>
              </div>
              <div className="h-gac-body">
                <div className="h-gac-section-label">GAME INFO</div>
                <div className="h-gac-info-row"><span className="h-gac-info-key">Game</span><span className={`h-gac-info-val ${gacGameClass}`}>{gacGame}</span></div>
                <div className="h-gac-info-row"><span className="h-gac-info-key">PID</span><span className={`h-gac-info-val ${gacPidClass}`}>{gacPid}</span></div>
                <div className="h-gac-info-row"><span className="h-gac-info-key">Status</span><span className={`h-gac-info-val ${gacStatusClass}`} style={{ color: gacStatusColor || '' }}>{gacStatus}</span></div>
                <div className="h-gac-divider" />
                <div className="h-gac-section-label">MODULES</div>
                <div className="h-gac-module-row"><div className={`h-gac-dot ${dotAc}`} /><span className="h-gac-module-name">AC Engine</span><span className={`h-gac-module-status s-${dotAc === 'online' ? 'online' : 'offline'}`}>{stAc}</span></div>
                <div className="h-gac-module-row"><div className={`h-gac-dot ${dotDll}`} /><span className="h-gac-module-name">Guard DLL</span><span className={`h-gac-module-status s-${dotDll === 'online' ? 'online' : 'offline'}`}>{stDll}</span></div>
                <div className="h-gac-module-row"><div className={`h-gac-dot ${dotSrv}`} /><span className="h-gac-module-name">Server</span><span className={`h-gac-module-status s-${dotSrv === 'online' ? 'online' : 'offline'}`}>{stSrv}</span></div>
                <div className="h-gac-module-row"><div className="h-gac-dot unloaded" /><span className="h-gac-module-name">Kernel Driver</span><span className="h-gac-module-status s-wip">UNLOADED</span></div>
                <div className="h-gac-build">Build: <span style={{ color: '#22c55e', opacity: 0.7 }}>Release</span></div>
                <button className="h-gac-btn" onClick={gacLaunch} style={{ color: btnColor || 'var(--green)', borderColor: btnColor || 'var(--green)' }}>{btnText}</button>
              </div>
            </div>
          </div>

        </div>

        <div className="h-hero-stats">
          <div className="h-stat"><span className="h-stat-num">Ring 0</span><div className="h-stat-label">KERNEL DRIVER</div></div>
          <div className="h-stat"><span className="h-stat-num">x64</span><div className="h-stat-label">ARCHITECTURE</div></div>
          <div className="h-stat"><span className="h-stat-num">WIP</span><div className="h-stat-label">DRIVER</div></div>
        </div>
      </section>

      <div className="h-divider" />

      {/* FEATURES */}
      <section className="h-section h-features" id="features">
        <div className="h-features-header h-reveal">
          <div className="h-section-label">Features</div>
          <h2 className="h-section-title">What's Already Implemented</h2>
          <p className="h-section-sub">A multi-layered detection system operating on the client side in tandem with the server.</p>
        </div>
        <div className="h-features-grid h-reveal h-reveal-d1">
          {[
            { icon: <svg viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="32" height="32" stroke="currentColor" strokeWidth="1.5" rx="2"/><path d="M12 20h6l3-8 4 16 3-8h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: 'Process Monitoring', desc: 'Real-time scanning and analysis of running processes. Detection of injectors, cheat engines, and suspicious modules.', wip: false },
            { icon: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1.5"/><path d="M20 6v4M20 30v4M6 20h4M30 20h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.5"/></svg>, title: 'Memory Integrity', desc: 'Control of game process memory integrity. Detection of external reads/writes, DLL injection, and code patching.', wip: false },
            { icon: <svg viewBox="0 0 40 40" fill="none"><path d="M8 32L32 8M16 8h16v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="6" y="24" width="12" height="12" stroke="currentColor" strokeWidth="1.5" rx="1"/></svg>, title: 'Server Verification', desc: 'All client data is verified server-side. Designed for integration with the game backend via API.', wip: false },
            { icon: <svg viewBox="0 0 40 40" fill="none"><path d="M20 4l14 7v10c0 8-6 13-14 15C12 34 6 29 6 21V11L20 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M14 20l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: 'Signature Scanning', desc: 'Scanning against a database of known cheat signatures. Updatable patterns without client restart.', wip: false },
            { icon: <svg viewBox="0 0 40 40" fill="none"><rect x="4" y="8" width="32" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="4" y="18" width="32" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="4" y="28" width="16" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M26 31l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: 'Behavioral Analysis', desc: 'Analysis of gameplay behavior patterns. Statistical models for detecting anomalies in aimbots and speedhacks.', wip: false },
            { icon: <svg viewBox="0 0 40 40" fill="none" style={{ color: '#f59e0b' }}><path d="M8 28V16l12-10 12 10v12l-12 8-12-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M20 6v28M8 16l12 8 12-8" stroke="currentColor" strokeWidth="1" opacity="0.5"/></svg>, title: 'Kernel Driver', desc: 'A Ring 0 kernel-level driver is in active development. It will provide protection at the lowest level, inaccessible to userspace cheats.', wip: true },
          ].map((f, i) => (
            <div key={i} className="h-feature-card">
              {f.wip && <div className="h-wip-badge">IN DEVELOPMENT</div>}
              <div className="h-feature-icon">{f.icon}</div>
              <div className="h-feature-title" style={f.wip ? { color: '#f59e0b' } : {}}>{f.title}</div>
              <p className="h-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="h-divider" />

      {/* ARCHITECTURE */}
      <section className="h-section h-arch" id="architecture">
        <div className="h-arch-inner">
          <div className="h-reveal">
            <div className="h-section-label">Architecture</div>
            <h2 className="h-section-title">Client + Server + Driver</h2>
            <p className="h-section-sub">A three-tier protection system. Each layer independently verifies state, eliminating the possibility of a single layer being compromised.</p>
            <ul className="h-arch-list">
              <li>Client launches alongside the game and runs in the background</li>
              <li>Server infrastructure receives and analyzes reports</li>
              <li>Driver (in development) will provide Ring 0 protection</li>
              <li>Mutual authentication of all system components</li>
              <li>Encrypted client-server communication channel</li>
            </ul>
          </div>
          <div className="h-arch-diagram h-reveal h-reveal-d2">
            <svg viewBox="0 0 400 540" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
              <rect x="110" y="10" width="180" height="52" rx="2" fill="#141d16" stroke="#22c55e" strokeWidth="1.5"/>
              <circle cx="130" cy="36" r="5" fill="#22c55e"><animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite"/></circle>
              <text x="144" y="32" fill="#e8f0ea" fontFamily="DM Mono, monospace" fontSize="11" fontWeight="500">EXECUTE GAC</text>
              <text x="144" y="47" fill="#5a7060" fontFamily="DM Mono, monospace" fontSize="10">Client launch</text>
              <line x1="200" y1="62" x2="200" y2="92" stroke="#2a3d2d" strokeWidth="1" strokeDasharray="3 3"/>
              <polygon points="196,88 200,96 204,88" fill="#2a3d2d"/>
              <circle r="3" fill="#22c55e" opacity="0.9"><animateMotion dur="2.2s" repeatCount="indefinite" path="M200,62 L200,92"/></circle>
              <rect x="110" y="96" width="180" height="52" rx="2" fill="#141d16" stroke="rgba(245,158,11,0.5)" strokeWidth="1" strokeDasharray="4 2"/>
              <circle cx="130" cy="122" r="5" fill="#f59e0b"><animate attributeName="opacity" values="1;0.3;1" dur="2.5s" repeatCount="indefinite"/></circle>
              <text x="144" y="118" fill="rgba(245,158,11,0.85)" fontFamily="DM Mono, monospace" fontSize="11">LOAD DRIVER</text>
              <text x="144" y="133" fill="rgba(245,158,11,0.45)" fontFamily="DM Mono, monospace" fontSize="10">Ring 0 · In development</text>
              <line x1="200" y1="148" x2="200" y2="178" stroke="#2a3d2d" strokeWidth="1" strokeDasharray="3 3"/>
              <polygon points="196,174 200,182 204,174" fill="#2a3d2d"/>
              <circle r="3" fill="#22c55e" opacity="0.9"><animateMotion dur="1.9s" repeatCount="indefinite" begin="0.4s" path="M200,148 L200,178"/></circle>
              <rect x="110" y="182" width="180" height="52" rx="2" fill="#141d16" stroke="#22c55e" strokeWidth="1.5"/>
              <circle cx="130" cy="208" r="5" fill="#22c55e"><animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/></circle>
              <text x="144" y="204" fill="#e8f0ea" fontFamily="DM Mono, monospace" fontSize="11">EXECUTING CHECKS</text>
              <text x="144" y="219" fill="#5a7060" fontFamily="DM Mono, monospace" fontSize="10">Scan · Memory · Sigs</text>
              <line x1="200" y1="234" x2="200" y2="264" stroke="#2a3d2d" strokeWidth="1" strokeDasharray="3 3"/>
              <polygon points="196,260 200,268 204,260" fill="#2a3d2d"/>
              <circle r="3" fill="#22c55e" opacity="0.9"><animateMotion dur="2s" repeatCount="indefinite" begin="0.8s" path="M200,234 L200,264"/></circle>
              <rect x="110" y="268" width="180" height="52" rx="2" fill="#141d16" stroke="#2a3d2d" strokeWidth="1"/>
              <circle cx="130" cy="294" r="5" fill="#9ab09e"><animate attributeName="opacity" values="1;0.4;1" dur="2.2s" repeatCount="indefinite"/></circle>
              <text x="144" y="290" fill="#9ab09e" fontFamily="DM Mono, monospace" fontSize="11">WAIT FOR GAME</text>
              <text x="144" y="305" fill="#5a7060" fontFamily="DM Mono, monospace" fontSize="10">Polling · Process watch</text>
              <line x1="200" y1="320" x2="200" y2="348" stroke="#2a3d2d" strokeWidth="1" strokeDasharray="3 3"/>
              <polygon points="196,344 200,352 204,344" fill="#2a3d2d"/>
              <polygon points="200,352 272,382 200,412 128,382" fill="#0c110e" stroke="#2a3d2d" strokeWidth="1"/>
              <text x="200" y="379" fill="#9ab09e" fontFamily="DM Mono, monospace" fontSize="10" textAnchor="middle">Server</text>
              <text x="200" y="393" fill="#9ab09e" fontFamily="DM Mono, monospace" fontSize="10" textAnchor="middle">available?</text>
              <line x1="128" y1="382" x2="72" y2="382" stroke="#22c55e" strokeWidth="1" strokeDasharray="3 3" opacity="0.5"/>
              <line x1="72" y1="382" x2="72" y2="448" stroke="#22c55e" strokeWidth="1" strokeDasharray="3 3" opacity="0.5"/>
              <polygon points="68,444 72,452 76,444" fill="#22c55e" opacity="0.6"/>
              <text x="86" y="377" fill="#22c55e" fontFamily="DM Mono, monospace" fontSize="10">YES</text>
              <circle r="3" fill="#22c55e" opacity="0.85"><animateMotion dur="2.6s" repeatCount="indefinite" begin="0.3s" path="M128,382 L72,382 L72,448"/></circle>
              <line x1="272" y1="382" x2="328" y2="382" stroke="#2a3d2d" strokeWidth="1" strokeDasharray="3 3"/>
              <line x1="328" y1="382" x2="328" y2="448" stroke="#2a3d2d" strokeWidth="1" strokeDasharray="3 3"/>
              <polygon points="324,444 328,452 332,444" fill="#2a3d2d"/>
              <text x="276" y="377" fill="#5a7060" fontFamily="DM Mono, monospace" fontSize="10">NO</text>
              <rect x="16" y="452" width="112" height="52" rx="2" fill="#141d16" stroke="#22c55e" strokeWidth="1.5"/>
              <circle cx="32" cy="478" r="4" fill="#22c55e"><animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite"/></circle>
              <text x="44" y="474" fill="#22c55e" fontFamily="DM Mono, monospace" fontSize="11">ONLINE</text>
              <text x="44" y="489" fill="#5a7060" fontFamily="DM Mono, monospace" fontSize="10">Srv connected</text>
              <rect x="272" y="452" width="112" height="52" rx="2" fill="#141d16" stroke="#2a3d2d" strokeWidth="1"/>
              <circle cx="288" cy="478" r="4" fill="#5a7060"><animate attributeName="opacity" values="1;0.4;1" dur="3s" repeatCount="indefinite"/></circle>
              <text x="300" y="474" fill="#5a7060" fontFamily="DM Mono, monospace" fontSize="11">OFFLINE</text>
              <text x="300" y="489" fill="#3d4f40" fontFamily="DM Mono, monospace" fontSize="10">Local only</text>
            </svg>
          </div>
        </div>
      </section>

      <div className="h-divider" />

      {/* STATUS */}
      <section className="h-section h-status" id="status">
        <div className="h-status-inner">
          <div className="h-reveal">
            <div className="h-section-label">System Status</div>
            <h2 className="h-section-title">Current State</h2>
            <p className="h-section-sub">Current status of Genesis AntiCheat components.</p>
          </div>
          <div className="h-status-grid h-reveal h-reveal-d1">
            {[
              { name: 'CLIENT', val: 'Active', cls: 'green', sub: 'Most features working', w: '80%', amber: false },
              { name: 'SERVER', val: 'Ready', cls: 'green', sub: 'Infrastructure deployed', w: '70%', amber: false },
              { name: 'KERNEL DRIVER', val: 'In Dev', cls: 'amber', sub: 'Ring 0 protection (WIP)', w: '35%', amber: true },
              { name: 'DETECTION', val: 'Active', cls: 'green', sub: 'Signatures updating', w: '65%', amber: false },
            ].map(s => (
              <div key={s.name} className="h-status-card">
                <div className="h-status-name">{s.name}</div>
                <div className={`h-status-val ${s.cls}`}>{s.val}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{s.sub}</div>
                <div className="h-status-bar"><div className={`h-status-bar-fill${s.amber ? ' amber' : ''}`} style={{ width: s.w }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-divider" />

      {/* HOW IT WORKS */}
      <section className="h-section h-how" id="how">
        <div className="h-how-inner">
          <div className="h-reveal">
            <div className="h-section-label">How It Works</div>
            <h2 className="h-section-title">Launch & Protection</h2>
            <p className="h-section-sub">From game launch to server verification — every step is automated.</p>
          </div>
          <div className="h-how-steps h-reveal h-reveal-d1">
            {[
              { n: '01', t: 'Client Launch', d: 'GAC starts alongside the game. Initializes protection modules and registers with the server.' },
              { n: '02', t: 'Environment Scan', d: 'Analysis of running processes, memory integrity checks, and system signature scanning.' },
              { n: '03', t: 'Real-Time Monitoring', d: 'Continuous monitoring during gameplay. Behavioral analysis and process memory control.' },
              { n: '04', t: 'Server Verdict', d: 'Data is sent to the server. The final verdict and action are determined server-side.' },
            ].map(s => (
              <div key={s.n} className="h-how-step">
                <div className="h-step-num">{s.n}</div>
                <div className="h-step-title">{s.t}</div>
                <p className="h-step-desc">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="h-cta" id="contact">
        <div className="h-cta-inner h-reveal">
          <h2 className="h-cta-title">Integrate<br /><span style={{ color: 'var(--green)' }}>Genesis AC</span></h2>
          <p className="h-cta-sub">Want to integrate GAC into your project? Reach out to discuss terms and details.</p>
          <div className="h-cta-actions">
            <a href="https://discord.gg/4cmNcDk37X" target="_blank" className="h-btn-primary">CONTACT US</a>
            <button className="h-btn-secondary" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              All Features
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="h-footer">
        <div className="h-footer-logo">Genesis <span>AntiCheat</span></div>
        <ul className="h-footer-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#architecture">Architecture</a></li>
          <li><a href="#status">Status</a></li>
        </ul>
        <div className="h-footer-copy">© 2026 Genesis AntiCheat — All rights reserved</div>
      </footer>
    </div>
  )
}