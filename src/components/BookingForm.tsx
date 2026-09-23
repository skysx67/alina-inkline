import { useEffect, useRef, useState } from 'react'
import type { BookingDraft } from '../types'

const emptyDraft: BookingDraft = {
  name: '',
  contact: '',
  idea: '',
  placement: '',
  size: '',
  preferredDate: '',
  referenceFileNames: [],
  demoConfirmed: false,
}

export function BookingForm() {
  const [draft, setDraft] = useState<BookingDraft>(emptyDraft)
  const [submitted, setSubmitted] = useState(false)
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hasDraft = Object.entries(draft).some(([key, value]) => key !== 'demoConfirmed' && (Array.isArray(value) ? value.length > 0 : Boolean(value)))
    if (!hasDraft || submitted) return
    const protectDraft = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', protectDraft)
    return () => window.removeEventListener('beforeunload', protectDraft)
  }, [draft, submitted])

  const update = <K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    setSubmitted(true)
    window.requestAnimationFrame(() => successRef.current?.focus())
  }

  if (submitted) {
    return (
      <div ref={successRef} className="booking-success" tabIndex={-1} role="status" aria-live="polite">
        <span className="booking-success__index">DEMO / 00</span>
        <h3>Заявка<br />собрана</h3>
        <p>В этом концепте данные никуда не отправляются. Когда появится Telegram‑интеграция, здесь будет безопасная передача заявки.</p>
        <div className="booking-success__summary">
          <span>{draft.name}</span>
          <span>{draft.contact}</span>
          <span>{draft.referenceFileNames.length ? `${draft.referenceFileNames.length} файл(а)` : 'Без файлов'}</span>
        </div>
        <button type="button" className="button button--inverted" onClick={() => { setDraft(emptyDraft); setSubmitted(false) }}>Собрать заново</button>
      </div>
    )
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate={false}>
      <div className="field field--half">
        <label htmlFor="name">Имя <span aria-hidden="true">*</span></label>
        <input id="name" name="name" autoComplete="name" required value={draft.name} onChange={(event) => update('name', event.target.value)} placeholder="Как к тебе обращаться…" />
      </div>
      <div className="field field--half">
        <label htmlFor="contact">Telegram или телефон <span aria-hidden="true">*</span></label>
        <input id="contact" name="contact" autoComplete="tel" inputMode="text" spellCheck={false} required value={draft.contact} onChange={(event) => update('contact', event.target.value)} placeholder="@username или +7…" />
      </div>
      <div className="field field--wide">
        <label htmlFor="idea">Идея татуировки <span aria-hidden="true">*</span></label>
        <textarea id="idea" name="idea" required rows={4} value={draft.idea} onChange={(event) => update('idea', event.target.value)} placeholder="Что хочется сделать? Можно описать ощущение, сюжет или направление…" />
      </div>
      <div className="field">
        <label htmlFor="placement">Место нанесения <span aria-hidden="true">*</span></label>
        <input id="placement" name="placement" autoComplete="off" required value={draft.placement} onChange={(event) => update('placement', event.target.value)} placeholder="Например: предплечье…" />
      </div>
      <div className="field">
        <label htmlFor="size">Примерный размер <span aria-hidden="true">*</span></label>
        <input id="size" name="size" autoComplete="off" required value={draft.size} onChange={(event) => update('size', event.target.value)} placeholder="Например: 10–12 см…" />
      </div>
      <div className="field">
        <label htmlFor="date">Желаемая дата <span aria-hidden="true">*</span></label>
        <input id="date" name="date" type="date" required value={draft.preferredDate} onChange={(event) => update('preferredDate', event.target.value)} />
      </div>
      <div className="field field--files">
        <span className="field-label">Референсы</span>
        <div className="file-picker">
          <input id="references" name="references" type="file" accept="image/*" multiple onChange={(event) => update('referenceFileNames', Array.from(event.target.files ?? []).map((file) => file.name))} />
          <label htmlFor="references">Выбрать изображения <span aria-hidden="true">↗</span></label>
        </div>
        <span aria-live="polite">{draft.referenceFileNames.length ? draft.referenceFileNames.join(' / ') : 'Можно выбрать несколько изображений. Файлы не загружаются.'}</span>
      </div>
      <label className="demo-check" htmlFor="demoConfirmed">
        <input id="demoConfirmed" name="demoConfirmed" type="checkbox" required checked={draft.demoConfirmed} onChange={(event) => update('demoConfirmed', event.target.checked)} />
        <span>Понимаю, что это демо‑форма и данные никуда не отправятся.</span>
      </label>
      <button type="submit" className="button button--submit cursor-arrow">Собрать заявку <span aria-hidden="true">↘</span></button>
      <p className="booking-form__note">DEMO MODE / NO NETWORK REQUEST / NO FILE UPLOAD</p>
    </form>
  )
}
