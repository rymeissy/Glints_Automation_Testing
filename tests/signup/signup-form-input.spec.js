import {test, expect} from '@playwright/test';
import {SignupPage} from '../../pages/signup.page.js';

test.describe('Signup Page - Positive Flow & Validation', () => {

    test.beforeEach(async ({page}) => {
        const signup = new SignupPage(page);
        await signup.goto();
    });

    test('TC01 - Verify all fields accept valid input', async ({page}) => {
        const signup = new SignupPage(page);
        const testData = signup.getTestData();

        for (const fieldName of Object.keys(testData)) {
            if (fieldName === 'location') continue;
            await signup.fillField(fieldName, testData[fieldName]);
        }
        await signup.selectLocation(testData.location);

        for (const fieldName of Object.keys(testData)) {
            const fieldElement = signup.fields[fieldName];

            if (fieldName === 'location' || fieldName === 'password') {
                await expect(fieldElement).not.toBeEmpty();
            } else {
                await expect(fieldElement).toHaveValue(testData[fieldName]);
            }
        }
    });

    /**
     * Assumption for testing purpose:
     * Assuming that the Location and WhatsApp Number fields have a normal border color (black).
     * Test cases are written based on this assumption.
     */
    test('TC02 - Verify normal border color appears for valid fields', async ({page}) => {
        const signup = new SignupPage(page);
        const testData = signup.getTestData();
        const normalBorderColor = 'rgb(0, 0, 0)';

        for (const fieldName of Object.keys(testData)) {
            if (fieldName === 'location') continue;
            await signup.fillField(fieldName, testData[fieldName]);
        }

        await signup.selectLocation(testData.location);

        for (const field of Object.values(signup.fields)) {
            await expect.soft(field).toHaveCSS('border-color', normalBorderColor);
        }
    });

    /**
     * Assumption for testing purpose:
     * Assuming that the WhatsApp Number field has a success icon.
     * Skip location field as it does not have success icon.
     * Test cases are written based on this assumption.
     */
    test('TC03 - Verify success icons appear for correctly filled fields', async ({page}) => {
        const signup = new SignupPage(page);
        const testData = signup.getTestData();

        for (const fieldName of Object.keys(testData)) {
            if (fieldName === 'location') continue;
            await signup.fillField(fieldName, testData[fieldName]);
            await page.locator('body').click();
            await expect.soft(signup.getSuccessIcon(fieldName)).toBeVisible();
        }
    });

    /**
     * Assumption for testing purpose:
     * Last Name field is treated as REQUIRED.
     * Expected behavior:
     * - When Last Name is cleared after being valid:
     *   - Success icon should disappear
     *   - Error icon should appear
     *   - Border color should turn red
     *   - Error message "Last Name is required." should be visible
     *
     * Actual behavior (BUG):
     * - Success icon is still visible
     * - Field returns to default state
     */
    test('TC04 - Success icon should disappear when Last Name field is cleared', async ({page}) => {
        const signup = new SignupPage(page);
        const { lastName } = signup.getTestData();
        const errorBorderColor = 'rgb(236, 39, 43)';

        await signup.fillField('lastName', lastName);
        await page.locator('body').click();
        await expect(signup.getSuccessIcon('lastName')).toBeVisible();

        // Clear field to trigger validation
        await signup.fields.lastName.fill('');
        await page.locator('body').click();

        // Assertions for expected behavior (Testing against the BUG)
        await expect.soft(signup.getSuccessIcon('lastName')).not.toBeVisible();
        await expect.soft(signup.getErrorIcon('lastName')).toBeVisible();
        await expect.soft(signup.fields.lastName).toHaveCSS('border-color', errorBorderColor);
        await expect.soft(signup.errorMessages.lastName).toBeVisible();
    });

    test('TC05 - Verify fields can be cleared after being filled', async ({ page }) => {
        const signup = new SignupPage(page);
        const testData = signup.getTestData();

        // Get all field names except location
        const fieldsToTest = Object.keys(signup.fields).filter(
            fieldName => fieldName !== 'location'
        );

        // Fill all fields with valid data
        for (const fieldName of fieldsToTest) {
            await signup.fillField(fieldName, testData[fieldName]);
        }

        // Clear all fields and verify they are empty
        for (const fieldName of fieldsToTest) {
            await signup.fields[fieldName].fill('');
            await page.locator('body').click();
            await expect(signup.fields[fieldName]).toHaveValue('');
        }
    });
});

