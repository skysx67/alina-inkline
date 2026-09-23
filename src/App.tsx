import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BookingForm } from './components/BookingForm'
import { CustomCursor } from './components/CustomCursor'
import { DirectionalBlurCanvas } from './components/DirectionalBlurCanvas'
import { Faq } from './components/Faq'
import { Header } from './components/Header'
import { Intro } from './components/Intro'
import { Picture } from './components/Picture'
import { PortfolioModal } from './components/PortfolioModal'
import { asset, site } from './site'
import { portfolio, processSteps } from './siteContent'
import type { PortfolioItem } from './types'

gsap.registerPlugin(ScrollTrigger)

function useMedia(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])
  return matches
}

function App() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [activeWork, setActiveWork] = useState<PortfolioItem | null>(null)
  const [returnFocusTo, setReturnFocusTo] = useState<HTMLElement | null>(null)
  const reducedMotion = useMedia('(prefers-reduced-motion: reduce)')
  const coarsePointer = useMedia('(pointer: coarse)')
  const narrowViewport = useMedia('(max-width: 767px)')
  const webGLEnabled = site.motion.enableWebGL && !reducedMotion && !narrowViewport
  const cursorEnabled = site.motion.enableCustomCursor && !reducedMotion && !coarsePointer

  useEffect(() => {
    if (reducedMotion || !site.motion.enableLenis) return
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1 })
    const update = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    lenis.on('scroll', ScrollTrigger.update)
    return () => {
      gsap.ticker.remove(update)
      lenis.destroy()
    }
  }, [reducedMotion])

  useLayoutEffect(() => {
    if (!rootRef.current) return
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set('[data-reveal], .manifest__word, .process-step, .collage-card', { clearProps: 'all' })
        return
      }

      gsap.from('.hero__title-line span', {
        yPercent: 115,
        rotate: 4,
        duration: 1.05,
        stagger: 0.08,
        ease: 'expo.out',
        delay: 0.35,
      })
      gsap.from('.hero__media', { clipPath: 'inset(46% 0 46% 0)', scale: 1.15, duration: 1.25, ease: 'expo.inOut', delay: 0.25 })
      gsap.from('.hero__meta > *', { y: 16, duration: 0.55, stagger: 0.06, ease: 'power2.out', delay: 0.75 })

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 24,
          duration: 0.55,
          ease: 'power2.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        })
      })

      gsap.from('.manifest__word', {
        yPercent: 45,
        stagger: 0.09,
        ease: 'none',
        scrollTrigger: { trigger: '.manifest', start: 'top 75%', end: 'bottom 65%', scrub: 0.8 },
      })

      gsap.to('.feature-work__image img', {
        yPercent: 12,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: { trigger: '.feature-work', start: 'top bottom', end: 'bottom top', scrub: 0.8 },
      })

      gsap.utils.toArray<HTMLElement>('.collage-card').forEach((card, index) => {
        gsap.fromTo(card, { yPercent: index % 2 ? 14 : -10, rotate: index % 2 ? 3 : -3 }, {
          yPercent: index % 2 ? -8 : 7,
          rotate: index % 2 ? -1 : 1,
          ease: 'none',
          scrollTrigger: { trigger: '.collage', start: 'top bottom', end: 'bottom top', scrub: 0.7 },
        })
      })

      if (!narrowViewport) {
        const track = document.querySelector<HTMLElement>('.works-track')
        const viewport = document.querySelector<HTMLElement>('.works-viewport')
        if (track && viewport) {
          const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth + 48)
          gsap.to(track, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: '.works-sticky',
              start: 'top top',
              end: () => `+=${Math.max(site.motion.desktopStickyDistance, distance() * 1.25)}`,
              pin: true,
              scrub: 0.9,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          })
        }
      }

      gsap.from('.process-step', {
        xPercent: (index) => index % 2 ? 10 : -10,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.process-list', start: 'top 78%', once: true },
      })

      gsap.to('.transition-scene__type--left', {
        xPercent: 18,
        ease: 'none',
        scrollTrigger: { trigger: '.transition-scene', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      })
      gsap.to('.transition-scene__type--right', {
        xPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: '.transition-scene', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      })

      const refresh = () => ScrollTrigger.refresh()
      window.addEventListener('load', refresh, { once: true })
      document.fonts.ready.then(refresh).catch(() => undefined)
      return () => window.removeEventListener('load', refresh)
    }, rootRef)
    return () => ctx.revert()
  }, [reducedMotion, narrowViewport])

  const openWork = (item: PortfolioItem, trigger: HTMLElement) => {
    setReturnFocusTo(trigger)
    setActiveWork(item)
  }

  return (
    <div ref={rootRef} className="site-shell" id="top">
      <a className="skip-link" href="#main-content">К основному содержанию</a>
      <Intro reducedMotion={reducedMotion} />
      <Header />
      <CustomCursor enabled={cursorEnabled} />

      <main id="main-content">
        <section className="hero section-grid" aria-labelledby="hero-title">
          <div className="hero__kicker label">ALINA INKLINE® / PERSONAL PRACTICE / 2026</div>
          <h1 id="hero-title" className="hero__title" aria-label="Alina Inkline">
            <span className="hero__title-line"><span>ALINA</span></span>
            <span className="hero__title-line hero__title-line--offset"><span>INKLINE</span></span>
          </h1>
          <Picture src="assets/images/generated-hero" alt="Татуированная модель в чёрно-белой editorial-съёмке" className="hero__media" loading="eager" fetchPriority="high" />
          <div className="hero__meta">
            <p className="hero__role">TATTOO ARTIST<br />TYUMEN / 72</p>
            <p className="hero__note">Я собираю татуировку вокруг идеи, тела и движения — не вокруг готового шаблона.</p>
            <a className="button button--hero cursor-arrow" href="#booking">Обсудить тату <span aria-hidden="true">↘</span></a>
          </div>
          <div className="hero__concept label">CONCEPT / TEMPORARY VISUALS</div>
          <a className="hero__scroll" href="#manifest"><span>SCROLL TO INK</span><i aria-hidden="true" /></a>
        </section>

        <section className="manifest section-grid" id="manifest" aria-labelledby="manifest-title">
          <p className="manifest__index label">MANIFESTO / 001</p>
          <h2 id="manifest-title" className="manifest__headline">
            {'Не копировать форму. Найти свою линию.'.split(' ').map((word, index) => <span key={`${word}-${index}`} className="manifest__word">{word} </span>)}
          </h2>
          <p className="manifest__copy" data-reveal>Мне важна не только картинка. Я смотрю, как линия живёт на теле, как меняется в движении и что останется важным после первого впечатления.</p>
        </section>

        <section className="feature-work" aria-label="Полноэкранная работа">
          <button type="button" className="feature-work__button cursor-view" onClick={(event) => openWork(portfolio[0], event.currentTarget)} title="Открыть работу в полноэкранном режиме">
            <Picture src={portfolio[0].image} alt={portfolio[0].alt} className="feature-work__image" />
            <span className="feature-work__caption"><b>{portfolio[0].title}</b><em>OPEN / FULL VIEW</em></span>
          </button>
        </section>

        <section className="collage section-grid" aria-labelledby="collage-title">
          <div className="section-heading collage__heading">
            <span className="label">STUDY / BODY / TRACE</span>
            <h2 id="collage-title">Кожа как<br /><i>пространство</i></h2>
          </div>
          {[portfolio[3], portfolio[4], portfolio[6]].map((item, index) => (
            <button type="button" key={item.id} className={`collage-card collage-card--${index + 1} cursor-view`} onClick={(event) => openWork(item, event.currentTarget)} title="Открыть работу">
              <Picture src={item.image} alt={item.alt} />
              <span>{item.title}</span>
            </button>
          ))}
          <p className="collage__stamp">NOT A CATALOGUE<br />A DIRECTION</p>
          <p className="collage__note" data-reveal>Здесь пока временные изображения для передачи ритма и атмосферы. Настоящие работы Алины заменят их без изменения композиции.</p>
        </section>

        <section className="works" id="works" aria-labelledby="works-title">
          <div className="works-sticky">
            <div className="works__header section-grid">
              <span className="label">SELECTED DIRECTION / 002—009</span>
              <h2 id="works-title">РАБОТЫ</h2>
              <p><span className="works__hint-desktop">Вертикальный скролл / горизонтальный архив</span><span className="works__hint-mobile">Листай вниз / нажми, чтобы открыть</span></p>
            </div>
            <div className="works-viewport">
              <div className="works-track">
                {portfolio.map((item, index) => (
                  <button type="button" key={item.id} className={`work-card work-card--${item.orientation} cursor-view`} onClick={(event) => openWork(item, event.currentTarget)} title="Открыть работу">
                    <Picture src={item.image} alt={item.alt} />
                    <span className="work-card__meta"><b>{String(index + 1).padStart(2, '0')} / {item.title}</b><em>{item.generated ? 'GENERATED EDITORIAL' : 'TEMPORARY STOCK'}</em></span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="about section-grid" id="about" aria-labelledby="about-title">
          <div className="about__eyebrow label">ABOUT / ALINA / TYUMEN</div>
          <div className="about__portrait-wrap" data-reveal>
            <Picture src="assets/images/stock-01" alt="Временный чёрно-белый портрет для раздела об Алине" className="about__portrait" />
            <span>PORTRAIT PLACEHOLDER</span>
          </div>
          <h2 id="about-title" className="about__title">Я Алина.<br />Тату‑мастер<br /><i>из Тюмени.</i></h2>
          <div className="about__copy" data-reveal>
            <p>Работаю с разными идеями: от тихой графики до более плотных композиций.</p>
            <p>Помогаю разобрать референс, адаптировать его под тело и подготовить индивидуальное решение — без копирования чужой работы один в один.</p>
          </div>
          <p className="about__aside label">TEMPORARY BIO / NO UNVERIFIED CLAIMS</p>
        </section>

        <section className="process section-grid" id="process" aria-labelledby="process-title">
          <div className="section-heading process__heading">
            <span className="label">HOW IT MOVES / 01—04</span>
            <h2 id="process-title">ОТ ИДЕИ<br />ДО КОЖИ</h2>
          </div>
          <div className="process-list">
            {processSteps.map((step) => (
              <article className="process-step" key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
          <aside className="care-card" data-reveal>
            <span className="care-card__marker">CLEAN / CLEAR / CALM</span>
            <h3>Стерильность<br />и уход</h3>
            <p>Одноразовые расходники вскрываются перед сеансом, рабочие поверхности защищаются и обрабатываются. После встречи ты получаешь понятные рекомендации по уходу.</p>
            <p className="care-card__small">Это общий принцип работы, а не медицинская гарантия. При необычной реакции кожи нужно обратиться к врачу.</p>
          </aside>
        </section>

        <section className="transition-scene" aria-label="Переход к вопросам">
          <DirectionalBlurCanvas enabled={webGLEnabled} />
          <div className="transition-scene__overlay" aria-hidden="true">
            <span className="transition-scene__type transition-scene__type--left">MOVE WITH</span>
            <span className="transition-scene__type transition-scene__type--right">THE LINE</span>
          </div>
          <p className="transition-scene__fallback-note label">ДВИЖЕНИЕ / ЛИНИЯ / ТЕЛО</p>
        </section>

        <section className="faq section-grid" id="faq" aria-labelledby="faq-title">
          <div className="section-heading faq__heading">
            <span className="label">BEFORE WE START / 005</span>
            <h2 id="faq-title">ВОПРОСЫ<br /><i>без загадок</i></h2>
          </div>
          <Faq />
        </section>

        <section className="booking section-grid" id="booking" aria-labelledby="booking-title">
          <div className="booking__intro">
            <span className="label">BOOKING DRAFT / DEMO ONLY</span>
            <h2 id="booking-title">РАССКАЖИ<br />СВОЮ <i>ИДЕЮ</i></h2>
            <p>Не нужно готовить идеальное ТЗ. Достаточно направления, места и пары референсов — остальное разберём вместе.</p>
          </div>
          <BookingForm />
        </section>

        <section className="final-cta section-grid" aria-labelledby="final-title">
          <p className="final-cta__eyebrow label">ALINA INKLINE / TATTOO ARTIST / TYUMEN</p>
          <h2 id="final-title">ЕСТЬ ИДЕЯ?<br /><i>ДАДИМ ЕЙ ФОРМУ.</i></h2>
          <a className="final-cta__button cursor-arrow" href="#booking">Обсудить тату <span aria-hidden="true">↘</span></a>
          <div className="final-cta__contacts">
            {site.socials.map((social) => social.active ? <a key={social.label} href={social.href}>{social.label}</a> : <span key={social.label} aria-disabled="true">{social.label} / скоро</span>)}
          </div>
          <div className="final-cta__footer">
            <span>© 2026 / CONCEPT</span>
            <span>ТЮМЕНЬ / 57.1522° N</span>
            <span>NO DATA SENT</span>
          </div>
          <img className="final-cta__texture" src={asset('assets/images/generated-motion.webp')} alt="" width="1536" height="1024" loading="lazy" />
        </section>
      </main>

      <PortfolioModal item={activeWork} onClose={() => setActiveWork(null)} returnFocusTo={returnFocusTo} />
    </div>
  )
}

export default App
