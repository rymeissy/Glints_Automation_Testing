export class SignupPage {
    constructor(page) {
        this.page = page;

        // Input fields
        this.fields = {
            firstName: page.locator('#sign-up-form-first-name'),
            lastName: page.locator('#sign-up-form-last-name'),
            email: page.locator('#sign-up-form-email'),
            password: page.locator('#sign-up-form-password'),
            location: page.locator('#location'),
            whatsApp: page.locator('input[aria-label="WhatsApp Number"]'),
        };

        // Buttons & checkbox
        this.signUpButton = page.getByRole('button', { name: 'Sign up', exact: true });
        this.newsletterCheckbox = page.getByText('Yes, fill me in on the latest');

        // Error messages
        this.errorMessages = {
            firstName: page.getByText('First name is required.'),
            lastName: page.getByText('Last name is required.'),
            email: page.getByText('Email is required.'),
            password: page.getByText('Password is required'),
            location: page.getByText('Your location is required.'),
            whatsApp: page.getByText('WhatsApp number is required.'),
        };
    }

    async goto() {
        await this.page.goto('https://staging.glints.com/id/en/signup-email');
    }

    async fillField(name, value) {
        await this.fields[name].fill(value);
    }

    async selectLocation(locationName) {
        await this.fields.location.click();
        await this.page.getByRole('option', { name: locationName }).click();
    }

    async submit() {
        await this.signUpButton.click();
    }

    getErrorIcon(field) {
        return this.fields[field]
            .locator('..')
            .locator('..')
            .locator('svg[data-testid="icon-svg"][fill="#EC272B"]');
    }

    getSuccessIcon(field) {
        return this.fields[field]
            .locator('..')
            .locator('..')
            .locator('svg[data-testid="icon-svg"][fill="#93BD49"]');
    }

    getTestData() {
        return {
            firstName: 'Sayang',
            lastName: 'Kucing',
            email: 'sayangkucing@example.com',
            password: 'StrongPassw0rd!',
            whatsApp: '81234567890',
            location: 'Kab. Morowali, Sulawesi Tengah',
        };
    }

}
