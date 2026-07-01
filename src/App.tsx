import { useCallback, useMemo, useState } from 'react'
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

type Heart = { id: number; left: number; delay: number; duration: number; size: number }

function App() {
  const [step, setStep] = useState(0)
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null)
  const [noTries, setNoTries] = useState(0)

  const finished = step >= STEPS.length
  const current = finished ? null : STEPS[step]

  const next = useCallback(() => {
    setNoPos(null)
    setNoTries(0)
    setStep((s) => s + 1)
  }, [])

  // Lässt den "Nein"-Button vor dem Mauszeiger weglaufen 😄
  const dodge = useCallback(() => {
    const x = Math.round((Math.random() - 0.5) * 320)
    const y = Math.round((Math.random() - 0.5) * 220)
    setNoPos({ x, y })
    setNoTries((n) => n + 1)
  }, [])

  const noLabel = useMemo(() => {
    const teasers = ['Nö', 'Sicher? 😳', 'Versuch\'s nochmal', 'Erwischst mich nicht!', 'Niemals 😜', 'Gib auf 💘']
    return teasers[Math.min(noTries, teasers.length - 1)]
  }, [noTries])

  const hearts = useMemo<Heart[]>(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 4 + Math.random() * 4,
        size: 16 + Math.random() * 28,
      })),
    [],
  )

  return (
    <div className="app">
      {finished ? (
        <div className="finale">
          <div className="hearts">
            {hearts.map((h) => (
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
                ❤️
              </span>
            ))}
          </div>
          <h1 className="big-message">Ich liebe dich ❤️</h1>
          <p className="sub">…und das meine ich ernst, {NAME}.</p>
          <button className="btn again" onClick={() => setStep(0)}>
            Nochmal 🔁
          </button>
        </div>
      ) : (
        <div className="card">
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
                style={
                  noPos
                    ? { transform: `translate(${noPos.x}px, ${noPos.y}px)` }
                    : undefined
                }
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
