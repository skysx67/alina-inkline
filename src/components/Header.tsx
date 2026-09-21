import { useEffect, useRef, useState } from 'react'
import { navItems } from '../siteContent'

export function Header() {
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const nextY = window.scrollY
        const delta = nextY - lastY.current
        if (Math.abs(delta) > 8) setHidden(delta > 0 && nextY > 120 && !menuOpen)
        lastY.current = nextY
        ticking.current = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [menuOpen])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <header className={`site-header ${hidden ? 'is-hidden' : ''} ${menuOpen ? 'is-open' : ''}`}>
      <a className="site-header__brand" href="#top" aria-label="AI/72 — ALINA INKLINE, к началу страницы">
        AI<span>/</span>72
      </a>
      <nav className="site-header__nav" aria-label="Основная навигация">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>{item.label}</a>
        ))}
      </nav>
      <a className="button button--header cursor-arrow" href="#booking">Обсудить тату</a>
      <button
        type="button"
        className="site-header__menu"
        aria-expanded={menuOpen}
        aria-controls="mobile-nav"
        aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
      </button>
      <nav id="mobile-nav" className="mobile-nav" aria-label="Мобильная навигация" aria-hidden={!menuOpen}>
        {navItems.map((item, index) => (
          <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1}>
            <span>0{index + 1}</span>{item.label}
          </a>
        ))}
        <a href="#booking" className="button" onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1}>Обсудить тату</a>
      </nav>
    </header>
  )
}
