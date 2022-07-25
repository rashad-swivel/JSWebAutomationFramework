const fs = require('fs');
const argv = require("yargs").argv;
const wdioParallel = require('wdio-cucumber-parallel-execution');
const { removeSync } = require('fs-extra');
const cucumberJson = require('wdio-cucumberjs-json-reporter').default;

const uploadResults = require('./uploadResults');

// The below module is used for cucumber html report generation
const reporter = require('cucumber-html-reporter');
const currentTime = new Date().toJSON().replace(/:/g, "-");
const sourceSpecDirectory = `tests/features/featureFiles/featureTest`;
const jsonTmpDirectory = `tests/reports/json/tmp/`;
const commonMethods = require('./tests/pages/commonMethods');

let featureFilePath = `${sourceSpecDirectory}/login.feature`;

// If parallel execution is set to true, then create the Split the feature files
// And store then in a tmp spec directory (created inside `the source spec directory)
if (argv.parallel === 'true') {

    tmpSpecDirectory = `${sourceSpecDirectory}/tmp`;
    wdioParallel.performSetup({
        sourceSpecDirectory: sourceSpecDirectory,
        tmpSpecDirectory: tmpSpecDirectory,
        cleanTmpSpecDirectory: true
    });
    featureFilePath = `${tmpSpecDirectory}//login.feature`;
}


exports.config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    //
    // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
    // on a remote machine).
    runner: 'local',
    automationProtocol: 'devtools',
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called. Notice that, if you are calling `wdio` from an
    // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
    // directory is where your package.json resides, so `wdio` will be called from there.
    //

    specs: [
        featureFilePath
    ],

    // Patterns to exclude.
    exclude: [
        `${sourceSpecDirectory}/sampleWebdriverioSearch.feature`
    ],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    //
    maxInstances: 3,
    //
    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://docs.saucelabs.com/reference/platforms-configurator
    //
    capabilities: [{

        // maxInstances can get overwritten per capability. So if you have an in-house Selenium
        // grid with only 5 firefox instances available you can make sure that not more than
        // 5 instances get started at a time.
        maxInstances: 3
        ,
        //
        browserName: 'chrome',
        //'goog:chromeOptions': { 
        //   args: ['--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--window-size=1920,1080']
        //}

        // If outputDir is provided WebdriverIO can capture driver session logs
        // it is possible to configure which logTypes to include/exclude.
        // excludeDriverLogs: ['*'], // pass '*' to exclude all driver session logs
        // excludeDriverLogs: ['bugreport', 'server'],
    }],
    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'info',
    //
    // Set specific log levels per logger
    // loggers:
    // - webdriver, webdriverio
    // - @wdio/applitools-service, @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
    // - @wdio/mocha-framework, @wdio/jasmine-framework
    // - @wdio/local-runner, @wdio/lambda-runner
    // - @wdio/sumologic-reporter
    // - @wdio/cli, @wdio/config, @wdio/sync, @wdio/utils
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevels: {
        webdriver: 'debug',
        '@wdio/applitools-service': 'info'
    },
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    baseUrl: 'http://localhost',
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 5000,
    //
    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 90000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    //
    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    //  services: ['selenium-standalone'],

    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: https://webdriver.io/docs/frameworks.html
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'cucumber',
    //
    // The number of times to retry the entire specfile when it fails as a whole
    // specFileRetries: 1,
    //
    // Whether or not retried specfiles should be retried immediately or deferred to the end of the queue
    // specFileRetriesDeferred: false,
    //
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: https://webdriver.io/docs/dot-reporter.html
    reporters: [
        // 'spec'

        ['cucumberjs-json', {
            jsonFolder: jsonTmpDirectory,
            language: 'en',

            //to turn on screenshots after every test
            //   useOnAfterCommandForScreenshot: true,

        }]
    ],

    //reporters: [ 'spec'],
    /* reporters: [['allure',{
         outputDir: './Reports/allure-results',
         disableWebdriverStepsReporting: true,
         disableWebdriverScreenshotsReporting: true,
     }]],*/

    //
    // If you are using Cucumber you need to specify the location of your step definitions.
    cucumberOpts: {
        require: [
            './tests/features/regression_testing/regressionSD.js',
            './tests/features/support/*.js'
        ],

        // <boolean> show full backtrace for errors
        backtrace: true,

        requireModule: [],

        // <boolean> invoke formatters without executing steps
        dryRun: false,

        // <boolean> abort the run on first failure
        failFast: false,

        // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
        format: ['[pretty]'],

        // <boolean> disable colors in formatter output
        colors: true,

        // <boolean> hide step definition snippets for pending steps
        snippets: true,

        // <boolean> hide source uris
        source: true,

        // <string[]> (name) specify the profile to use
        profile: [],

        // <boolean> fail if there are any undefined or pending steps
        strict: false,

        // <string> (expression) only execute the features or scenarios with tags matching the expression
        tagExpression: '',

        // <number> timeout for step definitions
        timeout: 120000,

        // <boolean> Enable this config to treat undefined definitions as warnings.
        ignoreUndefinedDefinitions: false
    },


    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    /**
     * Gets executed once before all workers get launched.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    onPrepare: () => {
        // Remove the `tmp/` folder that holds the json report files
        removeSync(jsonTmpDirectory);
        if (!fs.existsSync(jsonTmpDirectory)) {
            fs.mkdirSync(jsonTmpDirectory);
        }
        //Creating a folder path for the data file and initialising the command prompt argument to run the data file
        const path = require('path')
        const environment = './TestData/' + process.env.NODE_ENV.trim();

        require('dotenv').config({
            path: path.resolve(process.cwd(), './TestData/common.env')
        });
        require('dotenv').config({
            path: path.resolve(process.cwd(), environment + '.env')
        });
    },
    /**
     * Gets executed before a worker process is spawned and can be used to initialise specific service
     * for that worker as well as modify runtime environments in an async fashion.
     * @param  {String} cid      capability id (e.g 0-0)
     * @param  {[type]} caps     object containing capabilities for session that will be spawn in the worker
     * @param  {[type]} specs    specs to be run in the worker process
     * @param  {[type]} args     object that will be merged with the main configuration once worker is initialised
     * @param  {[type]} execArgv list of string arguments passed to the worker process
     */
    // onWorkerStart: function (cid, caps, specs, args, execArgv) {
    // },
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    beforeSession: function (config, capabilities, specs) {
        commonMethods.getCurrentTime("start");
    },
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    // before: function (capabilities, specs) {
    // },
    /**
     * Runs before a WebdriverIO command gets executed.
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     */
    // beforeCommand: function (commandName, args) {
    // },
    /**
     * Hook that gets executed before the suite starts
     * @param {Object} suite suite details
     */
    // beforeSuite: function (suite) {
    // },
    /**
     * Function to be executed before a test (in Mocha/Jasmine) starts.
     */
    /*beforeTest: function (test, context) {
        browser.maximizeWindow();
    },*/
    /**
     * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
     * beforeEach in Mocha)
     */
    // beforeHook: function (test, context) {
    // },


    /**
     * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
     * afterEach in Mocha)
     */
    /*   afterHook: function (test, context, { error, result, duration, passed, retries }) {
          browser.takeScreenshot();
          if (passed) {
             browser.takeScreenshot('./Reports/Screenshots'+date+'_Pass.png');
             cucumberJson.attach(browser.saveScreenshot('./Reports/Screenshots'+date+'_Pass.png'), 'image/png');
           }
      
      
      },*/




    /**
     * Function to be executed after a test (in Mocha/Jasmine).
     */
    /* afterTest: function(test, context, { error, result, duration, passed, retries }) {
         browser.takeScreenshot();
         if (passed) {
            browser.takeScreenshot('./Reports/Screenshots'+date+'_Pass.png');
            cucumberJson.attach(browser.saveScreenshot('./Reports/Screenshots'+date+'_Pass.png'), 'image/png');
          }
     },*/

    /*  afterTest: function (test, context, { error, result, duration, passed, retries }) {
       
         var date = Date.now();
 
         if (passed) {
             browser.takeScreenshot('./Reports/Screenshots'+date+'_Pass.png');
           }else if (error) {
             browser.takeScreenshot('./Reports/Screenshots'+date+'_Fail.png');
           }else if (result) {
             browser.takeScreenshot('./Reports/Screenshots'+date+'_Result.png');
           }
 
 
       },*/


    /**
     * Hook that gets executed after the suite has ended
     * @param {Object} suite suite details
     */
    // afterSuite: function (suite) {
    // },


    /**
     * Runs after a WebdriverIO command gets executed
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {Number} result 0 - command success, 1 - command error
     * @param {Object} error error object if any
     */
    // afterCommand: function (commandName, args, result, error) {
    // },
    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {Number} result 0 - test pass, 1 - test fail
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // after: function (result, capabilities, specs) {
    // },
    /**
     * Gets executed right after terminating the webdriver session.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    afterSession: function (config, capabilities, specs) {
        commonMethods.getCurrentTime("end");
        let executionTime = commonMethods.getExecutionTime();
        executionTime = executionTime.toFixed(2);
        commonMethods.writeFile(executionTime);
    },
    /**
     * Gets executed after all workers got shut down and the process is about to exit. An error
     * thrown in the onComplete hook will result in the test run failing.
     * @param {Object} exitCode 0 - success, 1 - fail
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {<Object>} results object containing test results
     */
    onComplete: async () => {

        //reading the saved execution time
        var path = "./Data_Files/executionTime.json";
        const jsonString = fs.readFileSync(path, 'utf-8')
        const data = JSON.parse(jsonString)
        console.log("Parsing JSON", data.executionTime);

        try {
            let consolidatedJsonArray = wdioParallel.getConsolidatedData({
                parallelExecutionReportDirectory: jsonTmpDirectory
            });

            let jsonFile = `${jsonTmpDirectory}report.json`;
            fs.writeFileSync(jsonFile, JSON.stringify(consolidatedJsonArray));

            var options = {
                theme: 'bootstrap',
                jsonFile: jsonFile,
                output: `tests/reports/html/report-${currentTime}.html`,
                reportSuiteAsScenarios: true,
                scenarioTimestamp: true,
                launchReport: true,
                ignoreBadJsonFile: true,
                metadata: {
                    "App Version": process.env.appVersion,
                    "Test Environment": process.env.environment,
                    "Browser": process.env.browser,
                    "Platform": process.env.platform,
                    "Parallel": process.env.parallel,
                    "Executed": process.env.executed,
                    "Execution Time": data.executionTime,
                }
            };

            reporter.generate(options);

          //  await uploadResults(consolidatedJsonArray)
        } catch (err) {
            console.log('error===', err);
        }


    }

    /* onComplete: function() {
         const reportError = new Error('Could not generate Allure report')
         const generation = allure(['generate', 'allure-results', '--clean'])
         return new Promise((resolve, reject) => {
             const generationTimeout = setTimeout(
                 () => reject(reportError),
                 5000)
 
             generation.on('exit', function(exitCode) {
                 clearTimeout(generationTimeout)
 
                 if (exitCode !== 0) {
                     return reject(reportError)
                 }
 
                 console.log('Allure report successfully generated')
                 resolve()
             })
         })
     }*/



    /**
    * Gets executed when a refresh happens.
    * @param {String} oldSessionId session ID of the old session
    * @param {String} newSessionId session ID of the new session
    */
    //onReload: function(oldSessionId, newSessionId) {
    //}
}
