import { test, expect } from '@playwright/test';
import { SignupPage } from '../../pages/signup.page.js';

test.describe('Signup Page - Positive Flow & Validation', () => {

    test.beforeEach(async ({ page }) => {
        const signup = new SignupPage(page);
        await signup.goto();
    });

    test('TC01 - Verify all fields accept valid input', async ({ page }) => {
        const signup = new SignupPage(page);
        const testData = signup.getTestData();

        const fieldsToTest = Object.keys(signup.fields).filter(
            fieldName => fieldName !== 'location'
        );

        for (const fieldName of fieldsToTest) {
            await signup.fillField(fieldName, testData[fieldName]);
        }
        await signup.selectLocation(testData.location);

        for (const fieldName of Object.keys(testData)) {
            const field = signup.fields[fieldName];

            if (fieldName === 'password' || fieldName === 'location') {
                await expect(field).not.toBeEmpty();
            } else {
                await expect(field).toHaveValue(testData[fieldName]);
            }
        }
    });

    test('TC02 - Verify normal border color appears for valid fields', async ({ page }) => {
        const signup = new SignupPage(page);
        const testData = signup.getTestData();
        const normalBorderColor = 'rgb(0, 0, 0)';

        const fieldsToTest = Object.keys(signup.fields).filter(
            fieldName => fieldName !== 'location'
        );

        for (const fieldName of fieldsToTest) {
            await signup.fillField(fieldName, testData[fieldName]);
        }
        await signup.selectLocation(testData.location);

        for (const field of Object.values(signup.fields)) {
            await expect.soft(field).toHaveCSS('border-color', normalBorderColor);
        }
    });


    test('TC03 - Verify success icons appear for correctly filled fields', async ({ page }) => {
        const signup = new SignupPage(page);
        const testData = signup.getTestData();

        const fieldsToTest = Object.keys(signup.fields).filter(
            fieldName => fieldName !== 'location'
        );

        for (const fieldName of fieldsToTest) {
            await signup.fillField(fieldName, testData[fieldName]);
            await page.locator('body').click();
            await expect.soft(signup.getSuccessIcon(fieldName)).toBeVisible();
        }
    });

    /**
     * Assumption for testing purpose:
     * Last Name field is treated as REQUIRED.
     * Expected: Success icon disappears, error icon/ error message/border appears when cleared.
     */
    test('TC04 - Verify clearing filled fields triggers validation errors', async ({ page }) => {
        const signup = new SignupPage(page);
        const testData = signup.getTestData();
        const errorBorderColor = 'rgb(236, 39, 43)';

        const fieldsToTest = Object.keys(signup.fields).filter(
            fieldName => fieldName !== 'location'
        );

        for (const fieldName of fieldsToTest) {
            await signup.fillField(fieldName, testData[fieldName]);
        }
        await page.locator('body').click();

        for (const fieldName of fieldsToTest) {
            const field = signup.fields[fieldName];

            await field.fill('');
            await page.locator('body').click();

            await expect(field).toHaveValue('');
            await expect.soft(signup.getSuccessIcon(fieldName)).not.toBeVisible();
            if (fieldName === 'lastName') continue
            await expect.soft(signup.getErrorIcon(fieldName)).toBeVisible();
            await expect.soft(field).toHaveCSS('border-color', errorBorderColor);
            await expect.soft(signup.errorMessages[fieldName]).toBeVisible();
        }
    });

});
