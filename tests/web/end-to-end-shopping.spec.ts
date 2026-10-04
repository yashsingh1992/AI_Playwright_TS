/**
 * Test Case: End-to-End Shopping Flow
 *
 * Tags: @master @regression @e2e @web
 *
 * Steps:
 * 1) Open the application
 * 2) Register a new customer using dynamically generated unique data
 * 3) Verify successful registration
 * 4) Log out
 * 5) Log in again using the newly created credentials
 * 6) Verify successful authentication
 * 7) Search for a known product
 * 8) Open the product details page
 * 9) Add the product to the cart
 * 10) Open the shopping cart
 * 11) Verify the correct product
 * 12) Verify the quantity
 * 13) Verify the product price
 * 14) Verify the applicable cart total
 * 15) Verify that the complete journey finishes without errors
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';

test('End-to-end shopping flow test @master @regression @e2e @web', async ({
    page,
    homePage,
    registrationPage,
    myAccountPage,
    logoutPage,
    loginPage,
    searchResultsPage,
    productPage,
    shoppingCartPage,
}) => {
    const { productName, productQuantity, totalPrice } = Helper.getProductDetails();

    const customer = {
        firstName: RandomDataUtil.getFirstName(),
        lastName: RandomDataUtil.getLastName(),
        email: RandomDataUtil.getEmail(),
        telephone: RandomDataUtil.getPhoneNumber(),
        password: RandomDataUtil.getPassword(),
    };

    // Collect any uncaught JavaScript errors raised by the application during the journey
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await test.step('1) Open the application', async () => {
        expect(await homePage.isHomePageExists()).toBeTruthy();
    });

    await test.step('2) Register a new customer with unique data', async () => {
        await homePage.clickMyAccount();
        await homePage.clickRegister();
        await registrationPage.completeRegistration(customer);
    });

    await test.step('3) Verify successful registration', async () => {
        const confirmationMsg = await registrationPage.getConfirmationMsg();
        expect(confirmationMsg).toContain('Your Account Has Been Created!');
    });

    await test.step('4) Log out', async () => {
        await myAccountPage.clickLogout();
        expect(await logoutPage.isLogoutPageExists()).toBeTruthy();
        await logoutPage.clickContinue();
    });

    await test.step('5) Log in again with the new credentials', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
        await loginPage.login(customer.email, customer.password);
    });

    await test.step('6) Verify successful authentication', async () => {
        expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
    });

    await test.step('7) Search for a known product', async () => {
        await homePage.enterProductName(productName);
        await homePage.clickSearch();
        expect(await searchResultsPage.isSearchResultsPageExists()).toBeTruthy();
        expect(await searchResultsPage.isProductExist(productName)).toBeTruthy();
    });

    await test.step('8) Open the product details page', async () => {
        await searchResultsPage.selectProduct(productName);
        expect(await productPage.getProductTitle()).toBe(productName);
    });

    await test.step('9) Add the product to the cart', async () => {
        await productPage.setQuantity(productQuantity);
        await productPage.addToCart();
        expect(await productPage.isConfirmationMessageVisible()).toBeTruthy();
    });

    await test.step('10) Open the shopping cart', async () => {
        await productPage.clickShoppingCart();
        expect(await shoppingCartPage.isShoppingCartPageExists()).toBeTruthy();
    });

    await test.step('11) Verify the correct product', async () => {
        expect(await shoppingCartPage.isProductInCart(productName)).toBeTruthy();
    });

    await test.step('12) Verify the quantity', async () => {
        expect(await shoppingCartPage.getProductQuantity(productName)).toBe(productQuantity);
    });

    await test.step('13) Verify the product price', async () => {
        expect(await shoppingCartPage.getProductUnitPrice(productName)).toBe(totalPrice);
        expect(await shoppingCartPage.getProductTotalPrice(productName)).toBe(totalPrice);
    });

    await test.step('14) Verify the applicable cart total', async () => {
        const cartTotal = await shoppingCartPage.getCartTotal();
        expect(cartTotal).toBe(totalPrice);
        expect(Helper.convertPriceToNumber(cartTotal)).toBe(Helper.convertPriceToNumber(totalPrice));
    });

    await test.step('15) Verify the journey finished without errors', async () => {
        expect(pageErrors).toEqual([]);
    });

    console.log('✅ ✔️ End-to-end shopping flow completed successfully!');
});
