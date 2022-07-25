const { Given, When, Then } = require('cucumber');

const loginPage = require('../../pages/loginPage.js');
const homePage = require('../../pages/homePage.js');


Given('I am on the login page _Login',async () => {
   await loginPage.openHomepage();
});

When('I fill in Username with _Login',async () => {
    await loginPage.enterCorrectUsername();
});

When('I fill in wrong Username with _Login',async () => {
    await loginPage.enterWrongUsername();
});

When('I fill in Password with _Login',async () => {
    await loginPage.enterCorrectPassword();
});

When('I fill in wrong Password with _Login',async () => {
    await loginPage.enterWrongPassword();
});

When('I click login button _Login',async () => {
    await loginPage.clickLoginButton();
});

Then('I should be on the users home page _Login',async () => {
    await homePage.verify_AppLauncher();
});

Then('I click logout _Login',async () => {
    await homePage.clickLogout();
});

Then('I should get an error message _Login',async () => {
    await loginPage.verifyErrorMessage();
});


