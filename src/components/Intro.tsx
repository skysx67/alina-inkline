import { useEffect, useMemo, useState } from 'react'
import { site } from '../site'

export function Intro({ reducedMotion }: { reducedMotion: boolean }) {
  const [visible, setVisible] = useState(!reducedMotion)
  const repeated = useMemo(() => {
    try {
      const seen = sessionStorage.getItem('inkline-intro-seen') === '1'
      sessionStorage.setItem('inkline-intro-seen', '1')
      return seen
    } catch {
      return false
    }
  }, [])

  useEffect(() => {
    if (reducedMotion) {
      document.body.dataset.introComplete = 'true'
      return
    }

    const duration = repeated ? site.motion.introRepeatMs : site.motion.introFirstVisitMs
    const timer = window.setTimeout(() => {
      setVisible(false)
      document.body.dataset.introComplete = 'true'
    }, duration)
    return () => window.clearTimeout(timer)
  }, [reducedMotion, repeated])

  if (!visible) return null

  return (
    <div className={`intro ${repeated ? 'intro--repeat' : ''}`} aria-hidden="true">
      <span className="intro__word intro__word--top">ALINA</span>
      <span className="intro__slash" />
      <span className="intro__word intro__word--bottom">INKLINE</span>
      <span className="intro__index">TYUMEN / 72</span>
    </div>
  )
}
