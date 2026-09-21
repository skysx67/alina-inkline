import type { MotionProfile, SocialLink } from './types'

export const site = {
  brand: 'ALINA INKLINE',
  city: 'Тюмень',
  role: 'Tattoo artist',
  demoMode: true,
  socials: [
    { label: 'Telegram', href: '', active: false },
    { label: 'Instagram', href: '', active: false },
  ] satisfies SocialLink[],
  motion: {
    introFirstVisitMs: 1350,
    introRepeatMs: 450,
    desktopStickyDistance: 3300,
    mobileStickyDistance: 900,
    enableLenis: true,
    enableWebGL: true,
    enableCustomCursor: true,
  } satisfies MotionProfile,
}

export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
