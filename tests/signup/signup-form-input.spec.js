import { test, expect } from '@playwright/test';
import { SignupPage } from '../../pages/signup.page.js';

test.describe('Signup Page - Positive Flow & Validation', () => {

    const testData = {
        firstName: 'Sayang',
        lastName: 'Kucing',
        email: 'sayangkucing@example.com',
        password: 'StrongPassw0rd!',
        whatsApp: '81234567890',
        location: 'Kab. Morowali, Sulawesi Tengah',
    };

    test.beforeEach(async ({ page }) => {
        const signup = new SignupPage(page);
        await signup.goto();
    });

    test('TC01 - Verify all fields accept valid input', async ({ page }) => {
        const signup = new SignupPage(page);

        for (const fillData of Object.keys(testData)) {
            if (fillData === 'location') continue;
            await signup.fillField(fillData, testData[fillData]);
        }

        await signup.selectLocation(testData.location);

        await expect(signup.fields.firstName).toHaveValue(testData.firstName);
        await expect(signup.fields.lastName).toHaveValue(testData.lastName);
        await expect(signup.fields.email).toHaveValue(testData.email);
        await expect(signup.fields.password).not.toBeEmpty();
        await expect(signup.fields.whatsApp).toHaveValue(testData.whatsApp);
        await expect(signup.fields.location).not.toBeEmpty();
    });

    test('TC02 - Verify normal border color appears for valid fields', async ({ page }) => {
        const signup = new SignupPage(page);
        const normalBorderColor = 'rgb(0, 0, 0)';

        for (const fieldName of Object.keys(testData)) {
            await signup.fillField(fieldName, testData[fieldName]);
        }

        await signup.selectLocation(testData.location);

        for (const field of Object.values(signup.fields)) {
            await expect.soft(field).toHaveCSS('border-color', normalBorderColor);
        }
    });

    test('TC03 - Verify success icons appear for correctly filled fields', async ({ page }) => {
        const signup = new SignupPage(page);

        for (const fieldName of Object.keys(testData)) {
            if (fieldName === 'location') continue;
            await signup.fillField(fieldName, testData[fieldName]);
            await page.locator('body').click();
            await expect.soft(signup.getSuccessIcon(fieldName)).toBeVisible();
        }
    });
});

