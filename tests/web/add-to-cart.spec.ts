/**
 * Test Case: Add Product to Cart
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Open the application
 * 2) Search for a valid known product
 * 3) Open the product details page
 * 4) Verify that the product details are displayed
 * 5) Set the required quantity when the product supports quantity selection
 * 6) Click Add to Cart
 * 7) Verify the product-added success/confirmation message
 * 8) Open the shopping cart
 * 9) Verify that the selected product is present
 * 10) Verify the displayed quantity matches the requested quantity
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Add product to cart test @master @sanity @regression @web', async ({
    homePage,
    searchResultsPage,
    productPage,
    shoppingCartPage,
}) => {
    const { productName, cartQuantity } = Helper.getProductDetails();

    // Products without a quantity field are added with the default quantity of 1
    let expectedQuantity = '1';

    await test.step('1) Open the application', async () => {
        expect(await homePage.isHomePageExists()).toBeTruthy();
    });

    await test.step('2) Search for a valid known product', async () => {
        await homePage.enterProductName(productName);
        await homePage.clickSearch();
        expect(await searchResultsPage.isSearchResultsPageExists()).toBeTruthy();
        expect(await searchResultsPage.isProductExist(productName)).toBeTruthy();
    });

    await test.step('3) Open the product details page', async () => {
        await searchResultsPage.selectProduct(productName);
        expect(await productPage.getProductTitle()).toBe(productName);
    });

    await test.step('4) Verify that the product details are displayed', async () => {
        expect(await productPage.isProductDetailsDisplayed()).toBeTruthy();
    });

    await test.step('5) Set the required quantity', async () => {
        if (await productPage.isQuantitySupported()) {
            await productPage.setQuantity(cartQuantity);
            expectedQuantity = cartQuantity;
        }
    });

    await test.step('6) Click Add to Cart', async () => {
        await productPage.addToCart();
    });

    await test.step('7) Verify the product-added confirmation message', async () => {
        expect(await productPage.isConfirmationMessageVisible()).toBeTruthy();
    });

    await test.step('8) Open the shopping cart', async () => {
        await productPage.clickShoppingCart();
        expect(await shoppingCartPage.isShoppingCartPageExists()).toBeTruthy();
    });

    await test.step('9) Verify that the selected product is present', async () => {
        expect(await shoppingCartPage.isProductInCart(productName)).toBeTruthy();
    });

    await test.step('10) Verify the displayed quantity matches the requested quantity', async () => {
        expect(await shoppingCartPage.getProductQuantity(productName)).toBe(expectedQuantity);
    });

    console.log('✅ ✔️ Add product to cart flow completed successfully!');
});
