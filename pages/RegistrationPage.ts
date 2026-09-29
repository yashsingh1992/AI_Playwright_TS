import { Page, Locator } from '@playwright/test';

export class RegistrationPage {
    private readonly page: Page;

    // Locators
    private readonly txtFirstname: Locator;
    private readonly txtLastname: Locator;
    private readonly txtEmail: Locator;
    private readonly txtTelephone: Locator;
    private readonly txtPassword: Locator;
    private readonly txtConfirmPassword: Locator;
    private readonly chkPrivacyPolicy: Locator;
    private readonly btnContinue: Locator;
    private readonly msgConfirmation: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtFirstname = page.locator('#input-firstname');
        this.txtLastname = page.locator('#input-lastname');
        this.txtEmail = page.locator('#input-email');
        this.txtTelephone = page.locator('#input-telephone');
        this.txtPassword = page.locator('#input-password');
        this.txtConfirmPassword = page.locator('#input-confirm');
        this.chkPrivacyPolicy = page.locator('input[name="agree"]');
        this.btnContinue = page.getByRole('button', { name: 'Continue' });
        this.msgConfirmation = page.locator('#content h1');
    }

    /**
     * Enters the first name
     * @param firstName - First name to enter
     */
    async setFirstName(firstName: string): Promise<void> {
        await this.txtFirstname.fill(firstName);
    }

    /**
     * Enters the last name
     * @param lastName - Last name to enter
     */
    async setLastName(lastName: string): Promise<void> {
        await this.txtLastname.fill(lastName);
    }

    /**
     * Enters the email address
     * @param email - Email address to enter
     */
    async setEmail(email: string): Promise<void> {
        await this.txtEmail.fill(email);
    }

    /**
     * Enters the telephone number
     * @param telephone - Telephone number to enter
     */
    async setTelephone(telephone: string): Promise<void> {
        await this.txtTelephone.fill(telephone);
    }

    /**
     * Enters the password
     * @param password - Password to enter
     */
    async setPassword(password: string): Promise<void> {
        await this.txtPassword.fill(password);
    }

    /**
     * Enters the password confirmation
     * @param password - Password to confirm
     */
    async setConfirmPassword(password: string): Promise<void> {
        await this.txtConfirmPassword.fill(password);
    }

    /**
     * Checks the Privacy Policy checkbox
     */
    async setPrivacyPolicy(): Promise<void> {
        await this.chkPrivacyPolicy.check();
    }

    /**
     * Clicks the Continue button to submit the form
     */
    async clickContinue(): Promise<void> {
        await this.btnContinue.click();
    }

    /**
     * Gets the heading shown after submitting the registration form
     * @returns Promise<string> - Confirmation heading text
     */
    async getConfirmationMsg(): Promise<string> {
        return (await this.msgConfirmation.textContent()) ?? '';
    }

    /**
     * Fills and submits the complete registration form
     * @param userData - Customer details used for registration
     */
    async completeRegistration(userData: {
        firstName: string;
        lastName: string;
        email: string;
        telephone: string;
        password: string;
    }): Promise<void> {
        try {
            await this.setFirstName(userData.firstName);
            await this.setLastName(userData.lastName);
            await this.setEmail(userData.email);
            await this.setTelephone(userData.telephone);
            await this.setPassword(userData.password);
            await this.setConfirmPassword(userData.password);
            await this.setPrivacyPolicy();
            await this.clickContinue();
            await this.page.waitForURL(/route=account\/success/);
        } catch (error) {
            console.log(`Error completing registration: ${error}`);
            throw error;
        }
    }
}
