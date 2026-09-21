import { useEffect, useRef, useState } from 'react'
import { asset } from '../site'

const vertex = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`

const fragment = `
precision highp float;
uniform sampler2D tMap;
uniform float uVelocity;
varying vec2 vUv;
void main() {
  vec2 direction = vec2(0.045 * uVelocity, 0.008 * uVelocity);
  vec4 color = vec4(0.0);
  color += texture2D(tMap, vUv - direction * 2.0) * 0.08;
  color += texture2D(tMap, vUv - direction) * 0.17;
  color += texture2D(tMap, vUv) * 0.50;
  color += texture2D(tMap, vUv + direction) * 0.17;
  color += texture2D(tMap, vUv + direction * 2.0) * 0.08;
  gl_FragColor = color;
}`

export function DirectionalBlurCanvas({ enabled }: { enabled: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [fallback, setFallback] = useState(!enabled)

  useEffect(() => {
    if (!enabled || !hostRef.current) {
      setFallback(true)
      return
    }
    const host = hostRef.current
    let disposed = false
    let cleanup = () => undefined
    setFallback(false)

    void import('ogl').then(({ Mesh, Program, Renderer, Texture, Triangle }) => {
      if (disposed) return
      let renderer: InstanceType<typeof Renderer>
      try {
        renderer = new Renderer({ alpha: false, dpr: Math.min(window.devicePixelRatio, 1.5) })
      } catch {
        setFallback(true)
        return
      }
      const gl = renderer.gl
      host.appendChild(gl.canvas)
      const geometry = new Triangle(gl)
      const texture = new Texture(gl)
      const image = new Image()
      image.src = asset('assets/images/generated-motion.webp')
      image.onload = () => { texture.image = image }
      const program = new Program(gl, { vertex, fragment, uniforms: { tMap: { value: texture }, uVelocity: { value: 0 } } })
      const mesh = new Mesh(gl, { geometry, program })
      let previousY = window.scrollY
      let velocity = 0
      let targetVelocity = 0
      let frame = 0

      const resize = () => {
        const rect = host.getBoundingClientRect()
        renderer.setSize(Math.max(rect.width, 1), Math.max(rect.height, 1))
      }
      const onScroll = () => {
        const delta = window.scrollY - previousY
        previousY = window.scrollY
        targetVelocity = Math.max(-1, Math.min(1, delta / 70))
      }
      const render = () => {
        velocity += (targetVelocity - velocity) * 0.12
        targetVelocity *= 0.91
        program.uniforms.uVelocity.value = velocity
        renderer.render({ scene: mesh })
        frame = requestAnimationFrame(render)
      }

      resize()
      window.addEventListener('resize', resize)
      window.addEventListener('scroll', onScroll, { passive: true })
      frame = requestAnimationFrame(render)
      cleanup = () => {
        cancelAnimationFrame(frame)
        window.removeEventListener('resize', resize)
        window.removeEventListener('scroll', onScroll)
        gl.canvas.remove()
        gl.getExtension('WEBGL_lose_context')?.loseContext()
      }
    }).catch(() => setFallback(true))

    return () => {
      disposed = true
      cleanup()
    }
  }, [enabled])

  return (
    <div ref={hostRef} className={`directional-canvas ${fallback ? 'directional-canvas--fallback' : ''}`}>
      {fallback ? <img src={asset('assets/images/generated-motion.webp')} alt="" width="1536" height="1024" loading="lazy" decoding="async" /> : null}
    </div>
  )
}
