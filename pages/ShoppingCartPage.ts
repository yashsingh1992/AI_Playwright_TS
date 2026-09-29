import { Page, Locator } from '@playwright/test';

export class ShoppingCartPage {
    private readonly page: Page;

    // Locators
    private readonly cartHeading: Locator;
    private readonly cartRows: Locator;
    private readonly lblCartTotal: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.cartHeading = page.getByRole('heading', { name: /Shopping Cart/, level: 1 });
        this.cartRows = page.locator('#content form tbody tr');
        this.lblCartTotal = page
            .locator('#content table tr')
            .filter({ has: page.getByText('Total:', { exact: true }) })
            .locator('td')
            .last();
    }

    /**
     * Returns the cart row that contains the given product
     * @param productName - Product name in the cart
     * @returns Locator - Row of the product in the cart table
     */
    private getProductRow(productName: string): Locator {
        return this.cartRows.filter({
            has: this.page.getByRole('link', { name: productName, exact: true }),
        });
    }

    /**
     * Verifies the shopping cart page is displayed
     * @returns Promise<boolean> - true if the "Shopping Cart" heading is visible
     */
    async isShoppingCartPageExists(): Promise<boolean> {
        try {
            await this.cartHeading.waitFor({ state: 'visible' });
            return await this.cartHeading.isVisible();
        } catch (error) {
            console.log(`Error checking shopping cart page: ${error}`);
            return false;
        }
    }

    /**
     * Checks whether the given product is present in the cart
     * @param productName - Product name to look for
     * @returns Promise<boolean> - true if the product row is visible
     */
    async isProductInCart(productName: string): Promise<boolean> {
        try {
            return await this.getProductRow(productName).isVisible();
        } catch (error) {
            console.log(`Error checking product in cart: ${error}`);
            return false;
        }
    }

    /**
     * Gets the quantity of the given product in the cart
     * @param productName - Product name in the cart
     * @returns Promise<string> - Quantity value
     */
    async getProductQuantity(productName: string): Promise<string> {
        return await this.getProductRow(productName).locator('input[name^="quantity"]').inputValue();
    }

    /**
     * Gets the unit price of the given product in the cart
     * @param productName - Product name in the cart
     * @returns Promise<string> - Unit price text (e.g. "$602.00")
     */
    async getProductUnitPrice(productName: string): Promise<string> {
        return (await this.getProductRow(productName).locator('td.text-right').first().textContent())?.trim() ?? '';
    }

    /**
     * Gets the row total of the given product in the cart
     * @param productName - Product name in the cart
     * @returns Promise<string> - Row total text (e.g. "$602.00")
     */
    async getProductTotalPrice(productName: string): Promise<string> {
        return (await this.getProductRow(productName).locator('td.text-right').last().textContent())?.trim() ?? '';
    }

    /**
     * Gets the cart grand total
     * @returns Promise<string> - Cart total text (e.g. "$602.00")
     */
    async getCartTotal(): Promise<string> {
        return (await this.lblCartTotal.textContent())?.trim() ?? '';
    }
}
