import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { PortfolioItem } from '../types'
import { Picture } from './Picture'

type PortfolioModalProps = {
  item: PortfolioItem | null
  onClose: () => void
  returnFocusTo: HTMLElement | null
}

export function PortfolioModal({ item, onClose, returnFocusTo }: PortfolioModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!item) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.querySelector<HTMLButtonElement>('.work-modal__close')?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      returnFocusTo?.focus()
    }
  }, [item, onClose, returnFocusTo])

  if (!item) return null

  return createPortal(
    <div className="work-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div ref={dialogRef} className="work-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="work-modal-title">
        <div className="work-modal__topline">
          <p>CONCEPT / TEMPORARY VISUALS</p>
          <button type="button" className="work-modal__close" onClick={onClose} aria-label="Закрыть полноэкранный просмотр">Закрыть <span aria-hidden="true">×</span></button>
        </div>
        <Picture src={item.image} alt={item.alt} className="work-modal__image" loading="eager" />
        <div className="work-modal__caption">
          <h2 id="work-modal-title">{item.title}</h2>
          <p>{item.caption}. Это визуал дизайн-концепта, а не реальная работа Алины.</p>
        </div>
      </div>
    </div>,
    document.body,
  )
}
