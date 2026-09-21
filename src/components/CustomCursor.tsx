import { useEffect, useRef } from 'react'

export function CustomCursor({ enabled }: { enabled: boolean }) {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled || !cursorRef.current) return
    const node = cursorRef.current
    let x = -100
    let y = -100
    let tx = -100
    let ty = -100
    let frame = 0

    const move = (event: PointerEvent) => {
      tx = event.clientX
      ty = event.clientY
      node.dataset.visible = 'true'
      const target = event.target as HTMLElement | null
      node.dataset.mode = target?.closest('.cursor-view') ? 'view' : target?.closest('.cursor-arrow') ? 'arrow' : 'default'
    }
    const leave = () => { node.dataset.visible = 'false' }
    const down = () => { node.dataset.pressed = 'true' }
    const up = () => { node.dataset.pressed = 'false' }
    const tick = () => {
      x += (tx - x) * 0.16
      y += (ty - y) * 0.16
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerleave', leave)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [enabled])

  if (!enabled) return null
  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true"><span className="custom-cursor__view">VIEW</span><span className="custom-cursor__arrow">↘</span></div>
}
