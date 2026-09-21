import { useRef, useState } from 'react'
import { faqItems } from '../siteContent'

export function Faq() {
  const [openId, setOpenId] = useState<string | null>(faqItems[0].id)
  const buttons = useRef<Array<HTMLButtonElement | null>>([])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const last = faqItems.length - 1
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? last : event.key === 'ArrowDown' ? (index + 1) % faqItems.length : (index - 1 + faqItems.length) % faqItems.length
    buttons.current[next]?.focus()
  }

  return (
    <div className="faq-list">
      {faqItems.map((item, index) => {
        const open = openId === item.id
        return (
          <article className={`faq-item ${open ? 'is-open' : ''}`} key={item.id}>
            <h3>
              <button
                ref={(node) => { buttons.current[index] = node }}
                type="button"
                aria-expanded={open}
                aria-controls={`faq-panel-${item.id}`}
                id={`faq-trigger-${item.id}`}
                onClick={() => setOpenId(open ? null : item.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                <span className="faq-item__number">0{index + 1}</span>
                <span>{item.question}</span>
                <span className="faq-item__mark" aria-hidden="true">{open ? '−' : '+'}</span>
              </button>
            </h3>
            <div id={`faq-panel-${item.id}`} role="region" aria-labelledby={`faq-trigger-${item.id}`} className="faq-item__panel" hidden={!open}>
              <p>{item.answer}</p>
            </div>
          </article>
        )
      })}
    </div>
  )
}
