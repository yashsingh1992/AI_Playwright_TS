import { Page, Locator } from '@playwright/test';
import { HomePage } from './HomePage';

export class LogoutPage {
    private readonly page: Page;

    // Locators
    private readonly msgHeading: Locator;
    private readonly btnContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.msgHeading = page.getByRole('heading', { name: 'Account Logout', level: 1 });
        this.btnContinue = page.locator('#content').getByRole('link', { name: 'Continue' });
    }

    /**
     * Verifies the Logout page is displayed
     * @returns Promise<boolean> - true if the "Account Logout" heading is visible
     */
    async isLogoutPageExists(): Promise<boolean> {
        try {
            await this.msgHeading.waitFor({ state: 'visible' });
            return await this.msgHeading.isVisible();
        } catch (error) {
            console.log(`Error checking Logout page: ${error}`);
            return false;
        }
    }

    /**
     * Clicks the Continue button to go back to the home page
     * @returns Promise<HomePage> - Instance of the home page
     */
    async clickContinue(): Promise<HomePage> {
        await this.btnContinue.click();
        return new HomePage(this.page);
    }
}
