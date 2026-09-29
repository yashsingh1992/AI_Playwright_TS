import { Page, Locator } from '@playwright/test';
import { ProductPage } from './ProductPage';

export class SearchResultsPage {
    private readonly page: Page;

    // Locators
    private readonly searchPageHeader: Locator;
    private readonly searchProducts: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.searchPageHeader = page.locator('#content h1');
        this.searchProducts = page.locator('.product-thumb h4');
    }

    /**
     * Verifies the search results page is displayed
     * @returns Promise<boolean> - true if the heading starts with "Search"
     */
    async isSearchResultsPageExists(): Promise<boolean> {
        try {
            const headerText = await this.searchPageHeader.textContent();
            return !!headerText?.includes('Search');
        } catch (error) {
            console.log(`Error checking search results page: ${error}`);
            return false;
        }
    }

    /**
     * Checks whether a product with the exact name is listed in the results
     * @param productName - Product name to look for
     * @returns Promise<boolean> - true if the product is listed
     */
    async isProductExist(productName: string): Promise<boolean> {
        try {
            return await this.searchProducts
                .getByRole('link', { name: productName, exact: true })
                .isVisible();
        } catch (error) {
            console.log(`Error checking product in results: ${error}`);
            return false;
        }
    }

    /**
     * Opens the product details page of the given product
     * @param productName - Product name to open
     * @returns Promise<ProductPage> - Instance of the product page
     */
    async selectProduct(productName: string): Promise<ProductPage> {
        await this.searchProducts.getByRole('link', { name: productName, exact: true }).click();
        return new ProductPage(this.page);
    }
}
