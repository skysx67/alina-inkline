export type PortfolioItem = {
  id: string
  title: string
  caption: string
  image: string
  alt: string
  orientation: 'portrait' | 'landscape' | 'square'
  generated?: boolean
}

export type FaqItem = {
  id: string
  question: string
  answer: string
}

export type ProcessStep = {
  number: string
  title: string
  text: string
}

export type SocialLink = {
  label: string
  href: string
  active: boolean
}

export type BookingDraft = {
  name: string
  contact: string
  idea: string
  placement: string
  size: string
  preferredDate: string
  referenceFileNames: string[]
  demoConfirmed: boolean
}

export type MotionProfile = {
  introFirstVisitMs: number
  introRepeatMs: number
  desktopStickyDistance: number
  mobileStickyDistance: number
  enableLenis: boolean
  enableWebGL: boolean
  enableCustomCursor: boolean
}
