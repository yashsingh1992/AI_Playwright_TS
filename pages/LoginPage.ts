import { Page, Locator } from '@playwright/test';

export class LoginPage {
    private readonly page: Page;

    // Locators
    private readonly txtEmailAddress: Locator;
    private readonly txtPassword: Locator;
    private readonly btnLogin: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtEmailAddress = page.locator('#input-email');
        this.txtPassword = page.locator('#input-password');
        this.btnLogin = page.locator('input[value="Login"]');
    }

    /**
     * Enters the email address
     * @param email - Email address to enter
     */
    async setEmail(email: string): Promise<void> {
        await this.txtEmailAddress.fill(email);
    }

    /**
     * Enters the password
     * @param password - Password to enter
     */
    async setPassword(password: string): Promise<void> {
        await this.txtPassword.fill(password);
    }

    /**
     * Clicks the Login button
     */
    async clickLogin(): Promise<void> {
        await this.btnLogin.click();
    }

    /**
     * Logs in with the given credentials
     * @param email - Email address to log in with
     * @param password - Password to log in with
     */
    async login(email: string, password: string): Promise<void> {
        try {
            await this.setEmail(email);
            await this.setPassword(password);
            await this.clickLogin();
        } catch (error) {
            console.log(`Error during login: ${error}`);
            throw error;
        }
    }
}
