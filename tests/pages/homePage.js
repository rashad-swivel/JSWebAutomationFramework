const NativePage = require('./native.page.js');

//===================================================================================================================
//Author :  Rashad 
//====================================================================================================================

class homePage extends NativePage {

/**
     * define selectors using getter methods
     */
    
    //header
    
    get linkUserIcon () { return $('//*[@data-icon="user-circle"]') }
    get linkLogout () { return $('//div[@title="Logout"]/descendant::div[text()="Logout"]') }
    get linkControlPanel () { return $('//div[@class="NavigationButtonMenu"]/descendant::a[@title="Control Panel"]') }
    get linkUser () { return $('//img[contains(@src,"public/art/images/icons/16/profileandarrow-16-white.png")]/ancestor::a') }
    get linkMyProfile () { return $('//a[@title="Edit your profile"]') }
    get linkActing () { return $('//div[@title="Acting"]') }
    get linkFoorterEForms () { return $('//div[@class="FooterLinkList-Item"]/descendant::a[text()="EForms"]') }
    get linkQuickLinks () { return $('//div[@class="FooterLinkList-Item"]/descendant::a[@class="InstanceFooter-QuicklinksButton"]') }


    get linkActUser_testAbsentee_2 () { return $('//div[@class="InstanceNavigationBar-ActAsOption-RoleName"][text()="testabsentee2"]') }
    get linkActUser_testRashad () { return $('//div[@class="InstanceNavigationBar-ActAsOption-RoleName"][text()="rashad"]') }

    //====================================================================================================================
    //Verifications
    //====================================================================================================================

    get btnContractManagement () { return $('//div[@id="CMSbanner"]') }
    get linkAppLauncher () { return $('//div[@class="NavigationBar-Part NavigationBar-LeftPart"]/descendant::a[@title="App Launcher"]') }
    get linkActUser_testAbsentee_2_Menubar () { return $('//div[@class="Floater PopupMenu enter-done"]/descendant::div[text()="testabsentee2"]') }
    


    //Clicks

    async clickControlPanel(){
        await browser.pause(3000);
        await (await this.linkControlPanel).waitForClickable({ timeout: 10000 });
        await (await this.linkControlPanel).click();
    }
    
    async clickEForms(){
        await (await this.linkFoorterEForms).waitForClickable({ timeout: 10000 });
        await (await this.linkFoorterEForms).click();
    }

    async clickQuickLinks(){
        await (await this.linkQuickLinks).waitForClickable({ timeout: 10000 });
        await (await this.linkQuickLinks).click();

    }

    async clickUser(){
        await browser.pause(2000);
        await (await this.linkUserIcon).waitForClickable({ timeout: 10000 });
        await (await this.linkUserIcon).click();

    }

    async clickMyProfile(){
        await (await this.linkUserIcon).waitForEnabled({ timeout: 10000 });
        await (await this.linkUserIcon).click();

        await (await this.linkMyProfile).waitForClickable({ timeout: 10000 });
        await (await this.linkMyProfile).click();

    }

    async clickActing(){
        
        await (await this.linkUserIcon).waitForEnabled({ timeout: 10000 });
        await (await this.linkUserIcon).click();

        await (await this.linkActing).waitForClickable({ timeout: 10000 });
        await (await this.linkActing).click();

    }

    async clickActUser_testAbsentee_2(){
        await browser.pause(2000);
        await (await this.linkActUser_testAbsentee_2).waitForEnabled({ timeout: 10000 });
        await (await this.linkActUser_testAbsentee_2).click();

    }


    async clickActUser_testAbsentee_2_Menubar(){
        await (await this.linkActUser_testAbsentee_2_Menubar).waitForClickable({ timeout: 10000 });
        await (await this.linkActUser_testAbsentee_2_Menubar).click();

    }

    async clickActUser_testUser(){
        await (await this.linkActUser_testRashad).waitForClickable({ timeout: 10000 });
        await (await this.linkActUser_testRashad).click();

    }


    async clickLogout(){
        await (await this.linkUserIcon).waitForEnabled({ timeout: 10000 });
        await (await this.linkUserIcon).click();

        await (await this.linkLogout).waitForEnabled({ timeout: 10000 });
        await (await this.linkLogout).click();
        await browser.deleteCookies();            // This delete cookies used to overcome cookies pop up issue on automation
    }

    //====================================================================================================================
    //Verifications
    //====================================================================================================================
    
    async verify_AppLauncher(){
        await (await this.linkAppLauncher).waitForDisplayed({ timeout: 10000 });
        await expect(await this.linkAppLauncher).toBeExisting();
    }

    async verify_ActUser_testAbsentee_2(){
        await (await this.linkActUser_testAbsentee_2).waitForDisplayed({ timeout: 10000 });
        await expect(await this.linkActUser_testAbsentee_2).toBeExisting();
    }
   
    async verify_ActUser_testAbsentee_2_Menubar(){
        await (await this.linkActUser_testAbsentee_2_Menubar).waitForDisplayed({ timeout: 10000 });
        await expect(await this.linkActUser_testAbsentee_2_Menubar).toBeExisting();
        await expect(await this.linkControlPanel).not.toBeExisting();

    }

    async verify_TestUser_ControlPanel(){
        await (await this.linkAppLauncher).waitForDisplayed({ timeout: 10000 });
        await expect(await this.linkControlPanel).toBeExisting();

    }

    async verify_TestUser_Menubar(){
        await (await this.linkAppLauncher).waitForDisplayed({ timeout: 10000 });
        await expect(await this.linkAppLauncher).toBeExisting();

    }

    

}
module.exports = new homePage();