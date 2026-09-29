import { Page, Locator } from '@playwright/test';
import { ShoppingCartPage } from './ShoppingCartPage';

export class ProductPage {
    private readonly page: Page;

    // Locators
    private readonly productTitle: Locator;
    private readonly txtQuantity: Locator;
    private readonly btnAddToCart: Locator;
    private readonly msgConfirmation: Locator;
    private readonly lnkShoppingCart: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.productTitle = page.locator('#content h1');
        this.txtQuantity = page.locator('#input-quantity');
        this.btnAddToCart = page.locator('#button-cart');
        this.msgConfirmation = page.locator('.alert.alert-success');
        this.lnkShoppingCart = page.locator('#top-links a[title="Shopping Cart"]');
    }

    /**
     * Gets the product name shown on the product details page
     * @returns Promise<string> - Product name
     */
    async getProductTitle(): Promise<string> {
        return (await this.productTitle.textContent())?.trim() ?? '';
    }

    /**
     * Enters the quantity to add to the cart
     * @param quantity - Quantity to enter
     */
    async setQuantity(quantity: string): Promise<void> {
        await this.txtQuantity.fill(quantity);
    }

    /**
     * Clicks the Add to Cart button
     */
    async addToCart(): Promise<void> {
        await this.btnAddToCart.click();
    }

    /**
     * Verifies the success message after adding the product to the cart
     * @returns Promise<boolean> - true if the success alert is visible
     */
    async isConfirmationMessageVisible(): Promise<boolean> {
        try {
            await this.msgConfirmation.waitFor({ state: 'visible' });
            return await this.msgConfirmation.isVisible();
        } catch (error) {
            console.log(`Error checking confirmation message: ${error}`);
            return false;
        }
    }

    /**
     * Opens the shopping cart from the header link
     * @returns Promise<ShoppingCartPage> - Instance of the shopping cart page
     */
    async clickShoppingCart(): Promise<ShoppingCartPage> {
        await this.lnkShoppingCart.click();
        return new ShoppingCartPage(this.page);
    }
}
