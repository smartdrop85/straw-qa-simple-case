import { test, expect } from '@playwright/test'
import { existingUsers } from '../../test-setup/localstorage.setup'
import { login } from '../../objects/login.obj'

test.describe.configure({ mode: 'serial' })

test.describe('login form tests', () => {
  const existingUser = existingUsers[0]

  test('logging in works with existing account', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator(login.header)).toBeVisible()
    await expect(page.locator(login.header)).toContainText('Login')

    await expect(page.locator(login.emailLabel)).toBeVisible()
    await expect(page.locator(login.emailLabel)).toContainText('Email')
    await page
      .locator(login.emailField)
      .pressSequentially(existingUser.email)

    await expect(page.locator(login.passwordLabel)).toBeVisible()
    await expect(page.locator(login.passwordLabel)).toContainText('Password')
    await page
      .locator(login.passwordField)
      .pressSequentially(existingUser.password)

    await expect(page.locator(login.showPasswordIcon)).toBeVisible()

    await expect(page.locator(login.submitButton)).toContainText('Login')

    await page.locator(login.submitButton).click()

    await expect(page.getByText('Log out')).toBeVisible()
    await expect(page.getByText(`Welcome ${existingUser.firstName} ${existingUser.lastName}`))
      .toBeVisible()
  })

  test('show password', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator(login.header)).toBeVisible()

    await expect(page.locator(login.emailLabel)).toBeVisible()

    await expect(page.locator(login.passwordLabel)).toBeVisible()

    await expect(page.locator(login.passwordField)).toHaveAttribute('type', 'password')
    await page
      .locator(login.passwordField)
      .pressSequentially(existingUser.password)

    await page.locator(login.showPasswordIcon).click()
    await expect(page.locator(login.passwordField)).toHaveAttribute('type', 'text')

    // hide password
    await page.locator(login.hidePasswordIcon).click()
    await expect(page.locator(login.passwordField)).toHaveAttribute('type', 'password')
  })
})
