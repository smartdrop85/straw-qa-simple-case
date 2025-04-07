import { test, expect } from '@playwright/test'
import { existingUsers } from '../../test-setup/localstorage.setup'
import { login } from '../../objects/login.obj'

test.describe.configure({ mode: 'serial' })

test.describe('login form tests', () => {
  test('logging in works with existing account', async ({ page }) => {
    await page.goto('localhost:8080/login')

    const existingUser = existingUsers[0]

    await page
      .locator(login.emailField)
      .pressSequentially(existingUser.email)

    await page
      .locator(login.passwordField)
      .pressSequentially(existingUser.password)

    await page.locator(login.submitButton).click()

    // Wait for 1 second until page is fully loaded
    await page.waitForTimeout(1000)
    await expect(page.getByText('Log out')).toBeVisible()
  })
})
