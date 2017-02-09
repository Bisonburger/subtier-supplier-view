# SSV End-to-End Testing
This is the E2E testing for Sub-tier Supplier Visualization.  E2E testing uses [Protractor](http://www.protractortest.org) with tests written in [Jasmine](https://jasmine.github.io/).  Protractor itself is a wrapper around a [Selenium server](http://www.seleniumhq.org/) specialized for AngularJS apps.

## Setting up

From this directory:

Install the dependencies:
```shell
$ npm install
```
	
Configure the Selenium Server:
```shell
$ npm run webdriver-update
$ npm run webdriver-update-ie
```	
This will download the specific web-drivers for the base Selenium server and for IE (currently version 2.53.1) into the node_modules directory structure for node to find.  Currently these commands (in the package.json file) are set up to work behind the firewall.  If you aren't behind the firewall - modify these as appropriate.

Launch the E2E tests from the Terminal:
```shell
$ npm test
```    
This will start up a selenium server on your local machine, running on an ephemeral port and connect the jasmine2 tests to the system-under-test via the server.  This server will only be running for the duration of the tests - but you should see an address for this server (it will change with each run) when launching the tests.  It should be a very rare instance when you'll need to directly interact with the server.

**Note**: the first time you run you'll be asked to allow Selenium server through your local machine's firewall.

By default, the tests expect the system-under-test to be running at http://localhost/ssv.  You can change this by setting an environment variable `SSV_URL` to the address of the system-under-test.
Currently, only localhost environments are supported (e.g. you can't set `SSV_URL` to https://j2ee.preprod.rms.ray.com/ssv or anything that isnt on localhost)

For example on Windows:
```shell
$ setx SSV_URL http://localhost:3000
```	
and the variable will be accessable after you start a new cmd prompt - not in the current one :-(	

or on real OS :-)
```shell
$ export SSV_URL=http://localhost:3000
```
and you're set!

After running the tests, a directory `html-results` will be created.  This directory will contain a web page documenting the test results with snapshots for any failed tests.

## Installation details

### Required and not included:
* [nodejs](https://nodejs.org/)
* npm (comes with nodejs)

### Directory Tour
```
. e2e
+-- html-results                    * directory created after tests are run - results of testing *
    +-- snapshots                   * directory created after tests are run - images of failed tests *
    internet explorer-test-report.html
+-- mocks                           * mocks used in testing *
    assembly-service-mock.js        * overrides for the AssemblySvc angular service *
    favorite-service-mock.js        * overrides for the FavoriteSvc angular service *
+-- node_modules                    * created during install - node packages used in testing *
+-- page-obj                        * PageObjects to encapsulate system behaviors *
    BomConfigurationSlideout.js     * behaviors for the Bom Configuration slide out *
    BomFilterSlideout.js            * behaviors for the Bom Filter slide out *
    BomViewPage.js                  * behaviors for the Bom View (material and supplier) *
    FavoritesDetailPage.js          * behaviors for the Favorites detail page (single favorite) *
    FavoritesPage.js                * behaviors for the Favorites page (list of favorites) *
+-- specs                           * jasmine2 test suites *
    add-favorites-spec.js
    configure-bom-spec.js
    filter-bom-spec.js
    view-favorites-spec.js
    view-material-bom-spec.js
custom-matchers.js                  * jasmine2 matchers used in the test - loaded prior to each suite *
GUIDE.md                            * a very basic guide to E2E testing with the RA5 framework *
helpers.js                          * utility functions used in the tests *
package.json                        * node package specification for node packages used in testing *
protractor-config.js                * configuration file for protractor *
README.md                           * this file *
```
## Behind the corporate firewall
If you are behind the corporate firewall, you may have to set up npm to play nice with the proxy (unless you've already done so)
```shell
$ npm set https-proxy http://tus-proxy.ext.ray.com:80
$ npm set proxy http://tus-proxy.ext.ray.com:80
$ npm set registry http://registry.npmjs.org/
$ npm set strict-ssl false
```
To verify that everything is set
```shell
$ npm config list
```