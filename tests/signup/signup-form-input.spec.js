// import { test, expect } from '@playwright/test';
//
// test.describe('Signup Page - Positive Flow & Validation', () => {
//
//     test.beforeEach(async ({ page }) => {
//         await page.goto('https://staging.glints.com/id/en/signup-email');
//     });
//
//     async function fillAllValidFields(page) {
//         const testData = {
//             firstName: 'Sayang',
//             lastName: 'Kucing',
//             email: 'sayangkucing@example.com',
//             password: 'StrongPassw0rd!',
//             whatsAppNumber: '81234567890',
//         };
//
//         const signUpFields = {
//             firstName: page.locator('#sign-up-form-first-name'),
//             lastName: page.locator('#sign-up-form-last-name'),
//             email: page.locator('#sign-up-form-email'),
//             password: page.locator('#sign-up-form-password'),
//             location: page.locator('#location'),
//             whatsAppNumber: page.locator('input[aria-label="WhatsApp Number"]'),
//         };
//
//         // Fill input fields
//         for (const fillData in signUpFields) {
//             if (fillData === 'location') continue;
//             await signUpFields[fillData].fill(testData[fillData]);
//         }
//
//         // Select location
//         await signUpFields.location.click();
//         await page.getByRole('option', { name: 'Kab. Morowali, Sulawesi Tengah' }).click();
//
//         return signUpFields;
//     }
//
//     test('TC01 - Verify all fields accept valid input', async ({ page }) => {
//         const signUpFields = await fillAllValidFields(page);
//
//         await expect(signUpFields.firstName).toHaveValue('Sayang');
//         await expect(signUpFields.lastName).toHaveValue('Kucing');
//         await expect(signUpFields.email).toHaveValue('sayangkucing@example.com');
//         await expect(signUpFields.password).not.toBeEmpty();
//         await expect(signUpFields.whatsAppNumber).toHaveValue('81234567890');
//         await expect(signUpFields.location).not.toBeEmpty();
//     });
//
//     test('TC02 - Verify success validation indicators appear', async ({ page }) => {
//         const signUpFields = await fillAllValidFields(page);
//         const correctBorderColor = 'rgb(0, 0, 0)';
//
//         // Verify border color
//         for (const field of Object.values(signUpFields)) {
//             await expect.soft(field).toHaveCSS('border-color', correctBorderColor);
//         }
//
//         // Verify success icon
//         for (const field of Object.values(signUpFields)) {
//             const successIcon = field
//                 .locator('..')
//                 .locator('..')
//                 .locator('svg[data-testid="icon-svg"][fill="#93BD49"]');
//
//             await expect.soft(successIcon).toBeVisible();
//         }
//     });
//
//     test('TC03 - Verify error message shown when email is already registered', async ({ page }) => {
//         await fillAllValidFields(page);
//
//         const signUpButton = page.getByRole('button', { name: 'Sign up', exact: true });
//         await signUpButton.click();
//
//         await expect(signUpButton).toHaveText('Please wait...');
//
//         const emailTakenError = page.getByText(/email already taken/i);
//         await expect(emailTakenError).toBeVisible();
//     });
//
//     // await expect(page.getByText(/email.*already/i)).toBeVisible();
//         // await page.waitForURL('**/onboarding-guided/job-interest');
//         // await expect(page).toHaveURL(/.*onboarding-guided\/job-interest/);
//
//
// });
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

