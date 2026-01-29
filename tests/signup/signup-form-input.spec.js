import { test, expect } from '@playwright/test';

test.describe('Signup Page - Positive Flow & Validation', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://staging.glints.com/id/en/signup-email');
    });

    async function fillAllValidFields(page) {
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
            location: page.locator('#location'),
            whatsAppNumber: page.locator('input[aria-label="WhatsApp Number"]'),
        };

        // Fill input fields
        for (const key in signUpFields) {
            if (key === 'location') continue;
            await signUpFields[key].fill(testData[key]);
        }

        // Select location
        await signUpFields.location.click();
        await page.getByRole('option', { name: 'Kab. Morowali, Sulawesi Tengah' }).click();

        return signUpFields;
    }

    // =========================
    // TC01
    // =========================
    test('TC01 - Verify all fields accept valid input', async ({ page }) => {
        const signUpFields = await fillAllValidFields(page);

        await expect(signUpFields.firstName).toHaveValue('Sayang');
        await expect(signUpFields.lastName).toHaveValue('Kucing');
        await expect(signUpFields.email).toHaveValue('sayangkucing@example.com');
        await expect(signUpFields.password).not.toBeEmpty();
        await expect(signUpFields.whatsAppNumber).toHaveValue('81234567890');
        await expect(signUpFields.location).not.toBeEmpty();
    });

    test('TC02 - Verify success validation indicators appear', async ({ page }) => {
        const signUpFields = await fillAllValidFields(page);
        const correctBorderColor = 'rgb(0, 0, 0)';

        // Verify border color
        for (const field of Object.values(signUpFields)) {
            await expect.soft(field).toHaveCSS('border-color', correctBorderColor);
        }

        // Verify success icon
        for (const field of Object.values(signUpFields)) {
            const successIcon = field
                .locator('..')
                .locator('..')
                .locator('svg[data-testid="icon-svg"][fill="#93BD49"]');

            await expect.soft(successIcon).toBeVisible();
        }
    });

    test('TC03 - Verify error message shown when email is already registered', async ({ page }) => {
        await fillAllValidFields(page);

        const signUpButton = page.getByRole('button', { name: 'Sign up', exact: true });
        await signUpButton.click();

        await expect(signUpButton).toHaveText('Please wait...');

        const emailTakenError = page.getByText(/email already taken/i);
        await expect(emailTakenError).toBeVisible();
    });

    // await expect(page.getByText(/email.*already/i)).toBeVisible();
        // await page.waitForURL('**/onboarding-guided/job-interest');
        // await expect(page).toHaveURL(/.*onboarding-guided\/job-interest/);


});
