import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('inkline-intro-seen', '1'))
  await page.goto('./')
  await expect(page.locator('h1')).toContainText('ALINA')
  await expect(page.locator('body')).toHaveAttribute('data-intro-complete', 'true', { timeout: 4_000 })
})

test('hero, navigation and auto-hide header work', async ({ page }) => {
  await expect(page.locator('body')).toHaveAttribute('data-intro-complete', 'true', { timeout: 4_000 })
  if ((page.viewportSize()?.width ?? 1440) < 768) {
    await page.locator('.site-header__menu').click()
    await page.locator('.mobile-nav a[href="#works"]').click()
  } else {
    await page.locator('.site-header__nav a[href="#works"]').click()
  }
  await expect(page).toHaveURL(/#works$/)
  await expect(page.locator('#works')).toBeInViewport()

  await page.evaluate(() => window.scrollBy(0, 600))
  await expect(page.locator('.site-header')).toHaveClass(/is-hidden/)
  await page.evaluate(() => window.scrollBy(0, -250))
  await expect(page.locator('.site-header')).not.toHaveClass(/is-hidden/)
})

test('portfolio modal traps focus, closes with Escape and restores focus', async ({ page }) => {
  const trigger = page.locator('.feature-work__button')
  await trigger.scrollIntoViewIfNeeded()
  await trigger.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(page.locator('.work-modal__close')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.locator('.work-modal__close')).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('FAQ toggles with accessible state', async ({ page }) => {
  const question = page.getByRole('button', { name: /Как формируется стоимость/ })
  await question.scrollIntoViewIfNeeded()
  await expect(question).toHaveAttribute('aria-expanded', 'true')
  await question.click()
  await expect(question).toHaveAttribute('aria-expanded', 'false')
  await question.click()
  await expect(page.locator('#faq-panel-price')).toBeVisible()
})

test('booking uses native validation and makes no request on submit', async ({ page }) => {
  const form = page.locator('.booking-form')
  await form.scrollIntoViewIfNeeded()
  await form.locator('button[type="submit"]').click()
  await expect(form.locator('#name')).toBeFocused()
  await expect(form.locator('#name')).toHaveJSProperty('validity.valid', false)

  await form.locator('#name').fill('Алина')
  await form.locator('#contact').fill('@alina')
  await form.locator('#idea').fill('Абстрактная линия и ветка')
  await form.locator('#placement').fill('Предплечье')
  await form.locator('#size').fill('12 см')
  await form.locator('#date').fill('2027-03-12')
  await form.locator('#demoConfirmed').check()

  let requestsAfterSubmit = 0
  const track = () => { requestsAfterSubmit += 1 }
  page.on('request', track)
  await form.locator('button[type="submit"]').click()
  await expect(page.getByRole('status')).toContainText('Заявка')
  await page.waitForTimeout(300)
  page.off('request', track)
  expect(requestsAfterSubmit).toBe(0)
})

test('reduced motion uses static fallback', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload()
  await expect(page.locator('.intro')).toHaveCount(0)
  await expect(page.locator('.directional-canvas--fallback img')).toBeAttached()
  await expect(page.locator('.works-track')).toHaveCSS('transform', 'none')
  await expect(page.locator('.pin-spacer')).toHaveCount(0)
})

test('page has no accidental horizontal overflow', async ({ page }) => {
  const overflow = await page.evaluate(() => {
    const mobileEmulation = /iPhone|Android/i.test(navigator.userAgent)
    const viewportWidth = mobileEmulation ? window.screen.width : document.documentElement.clientWidth
    return document.documentElement.scrollWidth - viewportWidth
  })
  expect(overflow).toBeLessThanOrEqual(1)
})

test('mobile headings and work cards stay readable at narrow widths', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-360')
  await page.emulateMedia({ reducedMotion: 'reduce' })

  for (const width of [320, 360, 390, 430]) {
    await page.setViewportSize({ width, height: 800 })
    const layout = await page.evaluate(() => {
      const selectors = ['.manifest__headline', '.collage__heading h2', '.about__title', '.process__heading h2', '.care-card h3', '.booking__intro h2', '.final-cta h2']
      const textBounds = selectors.map((selector) => {
        const element = document.querySelector(selector)!
        const range = document.createRange()
        range.selectNodeContents(element)
        const rects = Array.from(range.getClientRects())
        return { selector, left: Math.min(...rects.map((rect) => rect.left)), right: Math.max(...rects.map((rect) => rect.right)) }
      })
      const firstWork = document.querySelector('.work-card:first-child')!.getBoundingClientRect()
      const secondWork = document.querySelector('.work-card:nth-child(2)')!.getBoundingClientRect()
      return { textBounds, firstWorkBottom: firstWork.bottom, secondWorkTop: secondWork.top, viewportWidth: document.documentElement.clientWidth }
    })

    for (const bounds of layout.textBounds) {
      expect(bounds.left, `${width}px ${bounds.selector} starts outside the viewport`).toBeGreaterThanOrEqual(0)
      expect(bounds.right, `${width}px ${bounds.selector} ends outside the viewport`).toBeLessThanOrEqual(layout.viewportWidth)
    }
    expect(layout.firstWorkBottom, `${width}px work cards should stack vertically`).toBeLessThan(layout.secondWorkTop)
  }
})

test('process card and step numbers balance the divider on desktop', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chrome-1440')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload()
  for (const width of [1025, 1280, 1440, 1902]) {
    await page.setViewportSize({ width, height: 900 })
    const bounds = await page.evaluate(() => {
      const process = document.querySelector('.process')!
      const divider = process.getBoundingClientRect().left + parseFloat(getComputedStyle(process, '::before').left)
      return {
        title: document.querySelector('.process__heading')!.getBoundingClientRect().right,
        card: document.querySelector('.care-card')!.getBoundingClientRect().right,
        number: document.querySelector('.process-step > span')!.getBoundingClientRect().left,
        divider,
      }
    })
    expect(bounds.title, `${width}px title should stay left of the divider`).toBeLessThan(bounds.divider)
    expect(bounds.card, `${width}px card should stay left of the divider`).toBeLessThan(bounds.divider)
    expect(bounds.number, `${width}px numbers should stay right of the divider`).toBeGreaterThan(bounds.divider)
    expect(Math.abs((bounds.divider - bounds.card) - (bounds.number - bounds.divider)), `${width}px divider gaps should match`).toBeLessThanOrEqual(1)
  }
})

test('tablet booking fields do not squeeze into narrow columns', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chrome-1440')
  for (const width of [768, 1024, 1100]) {
    await page.setViewportSize({ width, height: 900 })
    const fields = await page.locator('.booking-form .field').evaluateAll((elements) =>
      elements.slice(0, 2).map((element) => element.getBoundingClientRect().toJSON()),
    )
    expect(fields[1].top, `${width}px contact field should follow the name field`).toBeGreaterThan(fields[0].bottom)
  }
})
