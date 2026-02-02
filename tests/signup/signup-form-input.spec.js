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
        const testData = signup.getTestData();
        const errorBorderColor = 'rgb(236, 39, 43)';

        // Step 1: Fill Last Name with valid value
        await signup.fillField('lastName', testData.lastName);
        await page.locator('body').click();

        // Pre-condition: success icon is visible
        await expect(signup.getSuccessIcon('lastName')).toBeVisible();

        // Step 2: Clear Last Name field
        await signup.fields.lastName.fill('');
        await page.locator('body').click();

        // Expected: success icon should disappear
        await expect.soft(signup.getSuccessIcon('lastName')).not.toBeVisible();

        // Expected: error icon should appear
        await expect.soft(signup.getErrorIcon('lastName')).toBeVisible();

        // Expected: border color turns red
        await expect.soft(signup.fields.lastName).toHaveCSS('border-color', errorBorderColor);

        // Expected: error message is displayed
        await expect.soft(signup.errorMessages.lastName).toBeVisible();
    });

    test('TC05 - Verify fields can be cleared after being filled', async ({ page }) => {
        const signup = new SignupPage(page);
        const testData = signup.getTestData();

        // Ambil semua field kecuali location
        const fieldsToTest = Object.keys(signup.fields).filter(
            fieldName => fieldName !== 'location'
        );

        // STEP 1: Isi semua field
        for (const fieldName of fieldsToTest) {
            await signup.fillField(fieldName, testData[fieldName]);
        }

        // STEP 2: Hapus isi field satu per satu
        for (const fieldName of fieldsToTest) {
            await signup.fields[fieldName].fill('');
            await page.locator('body').click();
            await expect(signup.fields[fieldName]).toHaveValue('');
        }
    });


});

