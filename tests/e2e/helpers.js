/*
 * RAYTHEON PROPRIETARY
 * 
 * 
 * Company Name: Raytheon Company Address 1151 E. Hermans Road, Tucson, AZ. 85706
 * 
 * Unpublished work Copyright 2016 Raytheon Company.
 * 
 * Contact Methods: RMS
 * 
 * This document contains proprietary data or information pertaining to items, or components, or processes, or other matter developed or acquired at
 * the private expense of the Raytheon Company and is restricted to use only by persons authorized by Raytheon in writing to use it. Disclosure to
 * unauthorized persons would likely cause substantial competitive harm to Raytheon's business position. Neither said document nor said technical data
 * or information shall be furnished or disclosed to or copied or used by persons outside Raytheon without the express written approval of Raytheon.
 * 
 * This Proprietary Notice Is Not Applicable If Delivered To The US Government
 */
 
var helpers = {

    get: function(url) {
        browser.driver.get(url)
            .then( () => { 
                browser.sleep(5000); 
                browser.driver.switchTo().alert()
                .then( (warning) => warning.accept(), () => console.log('No alert present!' ) ) });

        browser.driver.wait( () => browser.driver.getCurrentUrl()
            .then( (url) => browser.isElementPresent(by.className('ng-app'))
                .then( () => true )));
    },

    getAngularScript: function() {
        var path = require("path"),
            fs = require("fs"),
            angularMocksDir = path.dirname(require.resolve("angular")),
            angularMocksFilePath = path.join(angularMocksDir, "angular.js"),
            script = fs.readFileSync(angularMocksFilePath).toString();
        return script;
    },

    waitForId: function(id) {
        browser.driver.wait( () => browser.driver.getCurrentUrl()
            .then( (url) => browser.isElementPresent(by.id(id))
                .then( () => true )));
    },

    /**
     * Note that this doesnt work from IE...yet
     */
    logErrors: function() {
        browser.manage().logs().get('browser').then( (browserLogs) => {
            // browserLogs is an array of objects with level and message fields
            browserLogs.forEach( (log) =>  {
                if (log.level.value > 900) { // it's an error log
                    console.log('Browser console error!');
                    console.log(log.message);
                }
            });
        });
    }

};

module.exports = helpers;