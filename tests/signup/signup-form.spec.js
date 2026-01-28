import { test, expect } from '@playwright/test';

test.describe('Signup Page - UI Elements and Form Validation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://staging.glints.com/id/en/signup-email');
    });

    test('TC01 - Verify all mandatory fields are visible and enabled', async ({ page }) => {
        // Locators for all required fields
        const firstName = page.locator('#sign-up-form-first-name');
        const lastName = page.locator('#sign-up-form-last-name');
        const email = page.locator('#sign-up-form-email');
        const password = page.locator('#sign-up-form-password');
        const location = page.locator('#location');
        const whatsAppNumber = page.getByRole('textbox', { name: 'WhatsApp Number' });

        // Verify visibility of all fields
        await expect(firstName).toBeVisible();
        await expect(lastName).toBeVisible();
        await expect(email).toBeVisible();
        await expect(password).toBeVisible();
        await expect(location).toBeVisible();
        await expect(whatsAppNumber).toBeVisible();

        // Verify all fields are enabled for interaction
        await expect(firstName).toBeEnabled();
        await expect(lastName).toBeEnabled();
        await expect(email).toBeEnabled();
        await expect(password).toBeEnabled();
        await expect(location).toBeEnabled();
        await expect(whatsAppNumber).toBeEnabled();
    });

    test('TC02 - Verify newsletter checkbox toggle functionality', async ({ page }) => {
        const newsletterCheckbox = page.getByText('Yes, fill me in on the latest');

        // Verify default state is checked
        await expect(newsletterCheckbox).toBeChecked();

        // Toggle checkbox and verify unchecked state
        await newsletterCheckbox.click();
        await expect(newsletterCheckbox).not.toBeChecked();
    });

    test('TC03 - Verify signup button is disabled when all fields are empty', async ({ page }) => {
        const signUpButton = page.getByRole('button', { name: 'Sign up', exact: true });

        await expect(signUpButton).toBeVisible();
        await expect(signUpButton).toBeDisabled();
    });

    test('TC04 - Validate error messages appear for all empty required fields', async ({ page }) => {
        // Locators for error messages
        const firstNameError = page.getByText('First name is required.');
        const lastNameError = page.getByText('Last name is required.');
        const emailError = page.getByText('Password is required');
        const passwordError = page.getByText('Password is required');
        const locationError = page.getByText('Your location is required.');
        const whatsAppError = page.getByText('WhatsApp number is required.');

        // Click signup button without filling any fields
        const signUpButton = page.getByRole('button', { name: 'Sign up', exact: true });
        await signUpButton.click();

        // Verify all error messages are displayed
        await expect(firstNameError).toBeVisible();
        await expect.soft(lastNameError).toBeVisible();
        await expect(emailError).toBeVisible();
        await expect(passwordError).toBeVisible();
        await expect(locationError).toBeVisible();
        await expect(whatsAppError).toBeVisible();
    });

    test('TC05 - Validate visual error indicators for empty required fields', async ({ page }) => {
        // Field locators
        const firstNameField = page.locator('#sign-up-form-first-name');
        const lastNameField = page.locator('#sign-up-form-last-name');
        const emailField = page.locator('#sign-up-form-email');
        const passwordField = page.locator('#sign-up-form-password');
        const locationField = page.locator('#location');
        const whatsAppField = page.getByRole('textbox', { name: 'WhatsApp Number' });

        // Trigger validation by clicking signup button
        const signUpButton = page.getByRole('button', { name: 'Sign up', exact: true });
        await signUpButton.click();

        // Expected error border color (red)
        const errorBorderColor = 'rgb(236, 39, 43)';

        // Verify red border appears for all fields with validation errors
        await expect(firstNameField).toHaveCSS('border-color', errorBorderColor);
        await expect.soft(lastNameField).toHaveCSS('border-color', errorBorderColor);
        await expect(emailField).toHaveCSS('border-color', errorBorderColor);
        await expect(passwordField).toHaveCSS('border-color', errorBorderColor);
        await expect(locationField).toHaveCSS('border-color', errorBorderColor);
        await expect.soft(whatsAppField).toHaveCSS('border-color', errorBorderColor);
    });

    // test('TC06 - Verify location dropdown functionality', async ({ page }) => {
    //     const locationField = page.locator('#location');
    //
    //     // Click to open dropdown
    //     await locationField.click();
    //
    //     // Verify dropdown is visible
    //     const dropdownList = page.locator('[role="listbox"]');
    //     await expect(dropdownList).toBeVisible();
    //
    //     // Select a location option
    //     const firstOption = page.locator('[role="option"]').first();
    //     await firstOption.click();
    //
    //     // Verify location field has selected value
    //     await expect(locationField).not.toHaveValue('');
    // });

    // test('TC08 - Verify password field shows/hides password text', async ({ page }) => {
    //     const passwordField = page.locator('#sign-up-form-password');
    //     const passwordValue = 'TestPassword123';
    //
    //     // Enter password
    //     await passwordField.fill(passwordValue);
    //
    //     // Verify password is masked by default
    //     await expect(passwordField).toHaveAttribute('type', 'password');
    //
    //     // Find and click show password toggle (adjust selector as needed)
    //     const showPasswordToggle = page.locator('[aria-label*="show password"], [aria-label*="Show password"]').first();
    //     if (await showPasswordToggle.isVisible()) {
    //         await showPasswordToggle.click();
    //         await expect(passwordField).toHaveAttribute('type', 'text');
    //         await expect(passwordField).toHaveValue(passwordValue);
    //     }
    // });
});