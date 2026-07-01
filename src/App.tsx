import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

// ⬇️ Hier kannst du alles anpassen: Name, Fragen und die finale Botschaft
const NAME = 'kadda'

const STEPS = [
  {
    text: `Hey ${NAME}… ich hab da eine kleine Überraschung für dich 💕`,
    yes: 'Zeig her!',
  },
  {
    text: 'Erste Frage: Findest du mich eigentlich süß? 🥺',
    yes: 'Jaaa 😍',
    no: 'Nö',
  },
  {
    text: 'Denkst du manchmal an mich, wenn ich nicht da bin? 🥰',
    yes: 'Ständig! 💭',
    no: 'Nie',
  },
  {
    text: 'Letzte Frage… bereit für die Überraschung? 🎁',
    yes: 'Bereit! ✨',
    no: 'Warte!',
  },
] as const

type Heart = { id: number; left: number; delay: number; duration: number; size: number; emoji: string }
type Burst = { id: number; x: number; y: number; dx: number; dy: number; emoji: string; rot: number }
type Trail = { id: number; x: number; y: number; emoji: string; size: number; drift: number }

const EMOJIS = ['❤️', '💕', '💖', '💗', '💘', '✨', '🌸']

function App() {
  const [step, setStep] = useState(0)
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null)
  const [noTries, setNoTries] = useState(0)
  const [bursts, setBursts] = useState<Burst[]>([])
  const [trail, setTrail] = useState<Trail[]>([])
  const trailId = useRef(0)
  const lastSpawn = useRef(0)

  // Herz-Trail hinter dem Mauszeiger 💕
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const now = e.timeStamp
      // Nicht bei jedem Pixel ein Herz – alle ~55ms eins
      if (now - lastSpawn.current < 55) return
      lastSpawn.current = now
      const id = trailId.current++
      const h: Trail = {
        id,
        x: e.clientX,
        y: e.clientY,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        size: 12 + Math.random() * 12,
        drift: (Math.random() - 0.5) * 40,
      }
      setTrail((t) => [...t, h])
      window.setTimeout(() => setTrail((t) => t.filter((x) => x.id !== id)), 1000)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const finished = step >= STEPS.length
  const current = finished ? null : STEPS[step]

  // Herz-Explosion an der Klick-Position 💥
  const spawnBurst = useCallback((x: number, y: number) => {
    const count = 14
    const created: Burst[] = Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      const dist = 60 + Math.random() * 90
      return {
        id: Date.now() + i,
        x,
        y,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        rot: (Math.random() - 0.5) * 240,
      }
    })
    setBursts((b) => [...b, ...created])
    const ids = new Set(created.map((c) => c.id))
    window.setTimeout(() => setBursts((b) => b.filter((c) => !ids.has(c.id))), 900)
  }, [])

  const next = useCallback(
    (e: React.MouseEvent) => {
      spawnBurst(e.clientX, e.clientY)
      setNoPos(null)
      setNoTries(0)
      setStep((s) => s + 1)
    },
    [spawnBurst],
  )

  // Lässt den "Nein"-Button vor dem Mauszeiger weglaufen 😄
  const dodge = useCallback(() => {
    const x = Math.round((Math.random() - 0.5) * 340)
    const y = Math.round((Math.random() - 0.5) * 240)
    setNoPos({ x, y })
    setNoTries((n) => n + 1)
  }, [])

  const noLabel = useMemo(() => {
    const teasers = ['Nö', 'Sicher? 😳', "Versuch's nochmal", 'Erwischst mich nicht!', 'Niemals 😜', 'Gib auf 💘']
    return teasers[Math.min(noTries, teasers.length - 1)]
  }, [noTries])

  // Dauerhaft schwebende Hintergrund-Herzen
  const floaties = useMemo<Heart[]>(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 8,
        size: 14 + Math.random() * 26,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      })),
    [],
  )

  // Dichter Herzregen im Finale
  const rain = useMemo<Heart[]>(
    () =>
      Array.from({ length: 55 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 3.5 + Math.random() * 4,
        size: 16 + Math.random() * 30,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      })),
    [],
  )

  return (
    <div className={`app ${finished ? 'is-finale' : ''}`}>
      {/* Schwebende Hintergrund-Herzen (immer sichtbar) */}
      <div className="floaties" aria-hidden>
        {floaties.map((h) => (
          <span
            key={h.id}
            className="floaty"
            style={{
              left: `${h.left}%`,
              fontSize: `${h.size}px`,
              animationDelay: `${h.delay}s`,
              animationDuration: `${h.duration}s`,
            }}
          >
            {h.emoji}
          </span>
        ))}
      </div>

      {/* Klick-Explosionen */}
      <div className="burst-layer" aria-hidden>
        {bursts.map((b) => (
          <span
            key={b.id}
            className="burst"
            style={
              {
                left: b.x,
                top: b.y,
                fontSize: '22px',
                '--dx': `${b.dx}px`,
                '--dy': `${b.dy}px`,
                '--rot': `${b.rot}deg`,
              } as React.CSSProperties
            }
          >
            {b.emoji}
          </span>
        ))}
      </div>

      {/* Herz-Trail hinter dem Cursor */}
      <div className="trail-layer" aria-hidden>
        {trail.map((t) => (
          <span
            key={t.id}
            className="trail"
            style={
              {
                left: t.x,
                top: t.y,
                fontSize: `${t.size}px`,
                '--drift': `${t.drift}px`,
              } as React.CSSProperties
            }
          >
            {t.emoji}
          </span>
        ))}
      </div>

      {finished ? (
        <div className="finale">
          <div className="hearts" aria-hidden>
            {rain.map((h) => (
              <span
                key={h.id}
                className="heart"
                style={{
                  left: `${h.left}%`,
                  fontSize: `${h.size}px`,
                  animationDelay: `${h.delay}s`,
                  animationDuration: `${h.duration}s`,
                }}
              >
                {h.emoji}
              </span>
            ))}
          </div>
          <div className="glow-orb" aria-hidden />
          <h1 className="big-message" data-text="Ich liebe dich ❤️">
            Ich liebe dich ❤️
          </h1>
          <p className="sub">…bis zum Mond und zurück 🌙</p>
          <button className="btn again" onClick={(e) => { spawnBurst(e.clientX, e.clientY); setStep(0) }}>
            Nochmal 🔁
          </button>
        </div>
      ) : (
        <div className="card">
          <div className="progress-bar" aria-hidden>
            <span style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
          <p className="progress">
            {step + 1} / {STEPS.length}
          </p>
          <h2 className="question">{current!.text}</h2>

          <div className="buttons">
            <button className="btn yes" onClick={next}>
              {current!.yes}
            </button>

            {'no' in current! && current!.no && (
              <button
                className="btn no"
                style={noPos ? { transform: `translate(${noPos.x}px, ${noPos.y}px)` } : undefined}
                onMouseEnter={dodge}
                onClick={dodge}
              >
                {noLabel}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
