import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('page and portfolio dialog have no automatic WCAG 2.1 AA violations', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('inkline-intro-seen', '1'))
  await page.goto('./')
  await expect(page.locator('body')).toHaveAttribute('data-intro-complete', 'true', { timeout: 4_000 })

  const pageResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()
  expect(pageResults.violations).toEqual([])

  await page.locator('.feature-work__button').click()
  const dialogResults = await new AxeBuilder({ page })
    .include('.work-modal__dialog')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()
  expect(dialogResults.violations).toEqual([])
})
