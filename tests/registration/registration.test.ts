import { test, expect } from '@playwright/test'
import { registration } from '../../objects/registration.obj'
import { existingUsers } from '../../test-setup/localStorage.setup'

test.describe.configure({ mode: 'serial' })

test.describe('registration', () => {
  const password = 'Test1234!'
  const firstname = `Name${Math.floor(100 * Math.random())}`
  const lastname = `Surname${Math.floor(100 * Math.random())}`
  const email = `registration-${Date.now()}@test.com`
  const existingUser = existingUsers[0]

  test.beforeEach(async ({ page }) => {
    await page.goto('/signup')
    await expect(page.locator(registration.header)).toBeVisible()
    await expect(page.locator(registration.header)).toContainText('Become a member')
  })

  test('successful registration', async ({ page }) => {
    // first name field
    await expect(page.locator(registration.firstnameLabel)).toBeVisible()
    await expect(page.locator(registration.firstnameLabel)).toContainText('First name')
    await page
      .locator(registration.firstnameField)
      .pressSequentially(firstname)

    // last name field
    await expect(page.locator(registration.lastnameLabel)).toBeVisible()
    await expect(page.locator(registration.lastnameLabel)).toContainText('Last name')
    await page
      .locator(registration.lastnameField)
      .pressSequentially(lastname)

    // email field
    await expect(page.locator(registration.emailLabel)).toBeVisible()
    await expect(page.locator(registration.emailLabel)).toContainText('Email')
    await page
      .locator(registration.emailField)
      .pressSequentially(email)

    // password field
    await expect(page.locator(registration.passwordLabel)).toBeVisible()
    await expect(page.locator(registration.passwordLabel)).toContainText('Password')
    await page
      .locator(registration.passwordField)
      .pressSequentially(password)

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Log out')).toBeVisible()
    await expect(page.getByText(`Welcome ${firstname} ${lastname}`))
      .toBeVisible()
    })

  test('cannot register with existing user', async ({ page }) => {
    await page
      .locator(registration.firstnameField)
      .pressSequentially(existingUser.firstName)

    await page
      .locator(registration.lastnameField)
      .pressSequentially(existingUser.lastName)

    await page
      .locator(registration.emailField)
      .pressSequentially(existingUser.email)

    await page
      .locator(registration.passwordField)
      .pressSequentially(existingUser.password)

    await page.getByRole('button', { name: 'Submit' }).click()
    // aaand the test is failing because it is possible to register with existing user :)
    await expect(page.getByText('Email already exists')).toBeVisible()
  })
})
