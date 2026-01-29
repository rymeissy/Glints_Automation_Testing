import { test, expect } from '@playwright/test';

test.describe('Signup Page - UI Elements and Form Validation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://staging.glints.com/id/en/signup-email');
    });

    test('TC01 - Verify all mandatory fields are visible and enabled', async ({ page }) => {
        // Locators for all required fields
        const signUpForm = {
            firstNameField: page.locator('#sign-up-form-first-name'),
            lastNameField: page.locator('#sign-up-form-last-name'),
            emailField: page.locator('#sign-up-form-email'),
            passwordField: page.locator('#sign-up-form-password'),
            locationField: page.locator('#location'),
            whatsAppField: page.getByRole('textbox', { name: 'WhatsApp Number' }),
        };

        // Verify visibility of all fields
        for (const fields of Object.values(signUpForm)) {
            await expect(fields).toBeVisible();
        }

        // Verify all fields are enabled for interaction
        for (const fields of Object.values(signUpForm)) {
            await expect(fields).toBeEnabled();
        }
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
        const errorMessages = {
            firstName: page.getByText('First name is required.'),
            lastName: page.getByText('Last name is required.'),
            email: page.getByText('Email is required.'),
            password: page.getByText('Password is required'),
            location: page.getByText('Your location is required.'),
            whatsApp: page.getByText('WhatsApp number is required.'),
        };

        const signUpButton = page.getByRole('button', { name: 'Sign up', exact: true });
        await signUpButton.click();

        for (const error of Object.values(errorMessages)) {
            await expect.soft(error).toBeVisible();
        }
    });

    test('TC05 - Validate visual error indicators for empty required fields', async ({ page }) => {
        const signUpForm = {
            firstName: page.locator('#sign-up-form-first-name'),
            lastName: page.locator('#sign-up-form-last-name'),
            email: page.locator('#sign-up-form-email'),
            password: page.locator('#sign-up-form-password'),
            location: page.locator('#location'),
            whatsApp: page.getByRole('textbox', { name: 'WhatsApp Number' }),
        };

        const signUpButton = page.getByRole('button', { name: 'Sign up', exact: true });
        await signUpButton.click();

        const errorBorderColor = 'rgb(236, 39, 43)';

        for (const field of Object.values(signUpForm)) {
            await expect.soft(field).toHaveCSS('border-color', errorBorderColor);
        }
    });

    test('Validate error icon appears for empty required fields', async ({ page }) => {
        const signUpFields = {
            firstName: page.locator('#sign-up-form-first-name'),
            lastName: page.locator('#sign-up-form-last-name'),
            email: page.locator('#sign-up-form-email'),
            password: page.locator('#sign-up-form-password'),
            whatsApp: page.getByRole('textbox', { name: 'WhatsApp Number' }),
        };

        const signUpButton = page.getByRole('button', { name: 'Sign up', exact: true });
        await signUpButton.click();

        for (const field of Object.values(signUpFields)) {
            const errorIcon = field
                .locator('..')
                .locator('..')
                .getByTestId('icon-svg');

            await expect.soft(errorIcon).toBeVisible();
        }
    });
});