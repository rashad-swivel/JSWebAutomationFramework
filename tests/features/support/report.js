const cucumberJson = require ('wdio-cucumberjs-json-reporter').default;
//const allureTest = require('@wdio/allure-reporter').default



const {After, Status} = require('cucumber');

After((scenarioResult)=>{
    if (scenarioResult.result.status === Status.FAILED) {
        //cucumberJson.attach(browser.saveScreenshot(), 'image/png');
     cucumberJson.attach(browser.takeScreenshot(), 'image/png');
    }else if (scenarioResult.result.status === Status.PASSED) {
        //cucumberJson.attach(browser.saveScreenshot(), 'image/png');
      cucumberJson.attach(browser.takeScreenshot(), 'image/png');
     //  browser.saveScreenshot('C:\Users\HP\Documents\Final_CM_AutomationFramework\tests\reports\screenshots\sample.png');
      // console.log(browser.saveScreenshot('C:\Users\HP\Documents\Final_CM_AutomationFramework\tests\reports\screenshots\sample.png'));
    }
    return scenarioResult.status;
});

/*After((scenarioResult)=>{
    if (scenarioResult.result.status === Status.FAILED) {
        allureTest.attach(browser.takeScreenshot(), 'image/png');
    }else if (scenarioResult.result.status === Status.PASSED) {
        allureTest.attach(browser.takeScreenshot(), 'image/png');
    }
    return scenarioResult.status;
});*/