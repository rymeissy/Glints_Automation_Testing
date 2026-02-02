import { test, expect } from '@playwright/test';
import { SignupPage } from '../../pages/signup.page.js';

test.describe('Signup Page - UI Elements and Form Validation', () => {

    test.beforeEach(async ({ page }) => {
        const signup = new SignupPage(page);
        await signup.goto();
    });

    test('TC01 - Verify all mandatory fields are visible and enabled', async ({ page }) => {
        const signup = new SignupPage(page);

        for (const field of Object.values(signup.fields)) {
            await expect(field).toBeVisible();
            await expect(field).toBeEnabled();
        }
    });

    test('TC02 - Verify newsletter checkbox toggle functionality', async ({ page }) => {
        const signup = new SignupPage(page);

        await expect(signup.newsletterCheckbox).toBeChecked();
        await signup.newsletterCheckbox.click();
        await expect(signup.newsletterCheckbox).not.toBeChecked();
    });

    test('TC03 - Verify signup button is disabled when all fields are empty', async ({ page }) => {
        const signup = new SignupPage(page);

        await expect(signup.signUpButton).toBeVisible();
        await expect(signup.signUpButton).toBeDisabled();
    });

    /**
     * Assumption for testing purpose:
     * Last Name field is treated as REQUIRED.
     * Test cases are written based on this assumption.
     */
    test('TC04 - Validate error messages appear for all empty required fields', async ({ page }) => {
        const signup = new SignupPage(page);

        await signup.submit();

        for (const error of Object.values(signup.errorMessages)) {
            await expect.soft(error).toBeVisible();
        }
    });

    /**
     * Assumption for testing purpose:
     * Last Name field is treated as REQUIRED.
     * Test cases are written based on this assumption.
     */
    test('TC05 - Validate visual error indicators for empty required fields', async ({ page }) => {
        const signup = new SignupPage(page);
        const errorBorderColor = 'rgb(236, 39, 43)';

        await signup.submit();

        for (const field of Object.values(signup.fields)) {
            await expect.soft(field).toHaveCSS('border-color', errorBorderColor);
        }
    });

    /**
     * Assumption for testing purpose:
     * Last Name field is treated as REQUIRED.
     * Skip location field as it does not have error icon
     * Test cases are written based on this assumption.
     */
    test('TC06 - Validate error icon appears for empty required fields', async ({ page }) => {
        const signup = new SignupPage(page);

        await signup.submit();

        for (const fieldName of Object.keys(signup.fields)) {
            if (fieldName === 'location') continue;
            await expect.soft(signup.getErrorIcon(fieldName)).toBeVisible();
        }
    });
});
