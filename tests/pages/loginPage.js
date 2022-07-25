const NativePage = require('./native.page.js');


//===================================================================================================================
//Author :  Rashad 
//====================================================================================================================

class loginPage extends NativePage {

 /**
     * define selectors using getter methods
     */
    get inputUsername () { return $('//input[@placeholder="Username"]') }
    get inputPassword () { return $('//input[@placeholder="Password"]') }
    get btnLogin () { return $('//button[@title="Login"]') }

    //====================================================================================================================
    //Verifications
    //====================================================================================================================
    get lblErrorMessage () { return $('//div[text()="Incorrect username or password."]') }
    get lblErrorMessage_AccountExpired () { return $('//div[text()="Account expired."]') }
    get lblErrorMessage_AccountDisabled () { return $('//div[text()="Account disabled."]') }
    get lblErrorMessage_AccountLocked () { return $('//div[text()="Account is locked."]') }
    get lblErrorMessage_RoleTypelocked () { return $('//div[text()="Role type cannot login."]') }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */

     async openHomepage() {
       await browser.url(process.env.nimblex_url);
       //await browser.maximizeWindow();
    }

    async openDevAutoLogin_admin(){
      await browser.url(process.env.nimblex_auto_login_admin);

    }

    async openAutoLogin_testauthpassword(){
      await browser.url(process.env.nimblex_auto_login_admin);

    }

    async closewebdriverIOHomepage() {
      await browser.closeWindow();

    }

    async enterCorrectUsername(){

      await (await this.inputUsername).setValue(process.env.nimblex_username);
    }

    async enterWrongUsername(){

      await (await this.inputUsername).setValue(process.env.nimblex_Wrong_Username);
    }

    async enterCorrectPassword(){

      await (await this.inputPassword).setValue(process.env.nimblex_password);
    }

    async enterWrongPassword(){

      await (await this.inputPassword).setValue(process.env.nimblex_Wrong_Password);
    }

    async clickLoginButton(){

      await (await this.btnLogin).click();
    }


    async loginCredentials(){

      //const userName = await this.inputUsername
      await (await this.inputUsername).setValue(process.env.nimblex_username);
      await (await this.inputPassword).setValue(process.env.nimblex_password);
      await (await this.btnLogin).click();
      

    }

   

    //====================================================================================================================
    //Verifications
    //====================================================================================================================

    async verifyErrorMessage(){

      await (await this.lblErrorMessage).waitForDisplayed({ timeout: 10000 });
      await expect(await this.lblErrorMessage).toBeExisting();

    }

   


}module.exports = new loginPage();