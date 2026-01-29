import { test, expect } from '@playwright/test';

test.describe('Signup Page - Field input and Format Validation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://staging.glints.com/id/en/signup-email');
    });

    test('TC01 - Verify success state when all fields are filled correctly', async ({ page }) => {
        const testData = {
            firstName: 'Sayang',
            lastName: 'Kucing',
            email: 'sayangkucing@example.com',
            password: 'StrongPassw0rd!',
            whatsAppNumber: '81234567890',
        };

        const signUpFields = {
            firstName: page.locator('#sign-up-form-first-name'),
            lastName: page.locator('#sign-up-form-last-name'),
            email: page.locator('#sign-up-form-email'),
            password: page.locator('#sign-up-form-password'),
            whatsAppNumber: page.locator('input[aria-label="WhatsApp Number"]'),
        };

        // Fill all input fields
        for (const fillData in signUpFields) {
            await signUpFields[fillData].fill(testData[fillData]);
        }

        // Select location from dropdown
        await page.click('#location');
        await page.getByRole('option', { name: 'Kab. Morowali, Sulawesi Tengah' }).click();
    });
});

