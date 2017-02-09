var helper = require('./helpers');

exports.config = {

	getPageTimeout: 30000, // wait up to 30seconds
	directConnect: false,
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 30000,
		isVerbose: false,
		includeStackTrace: false
	},
	//2.53.1
	seleniumArgs: ['-Dwebdriver.ie.driver=./node_modules/webdriver-manager/selenium/IEDriverServer_Win32_2.53.1.exe'],
	//seleniumArgs: ['-Dwebdriver.gecko.driver=./node_modules/webdriver-manager/selenium/geckodriver-v0.12.0.exe'],

	capabilities: {
		browserName: 'internet explorer',
		pageLoadingStrategy: 'eager',
		ignoreProtectedModeSettings: true,
		version: '11'
	},

	baseUrl: process.env.SSV_URL || 'http://localhost/ssv',

	framework: 'jasmine2',

	suites: {
		favorites: ['page-obj/**/*.js', 'mocks/**/*.js', 'specs/view-favorites-spec.js', 'specs/add-favorites-spec.js'],
		bom: ['page-obj/**/*.js', 'mocks/**/*.js', 'specs/view-material-bom-spec.js']
	},

	onPrepare: function(){
		helper.get(process.env.SSV_URL || 'http://localhost/ssv');

		/*
		var fs = require('fs-extra');
		
		fs.remove( './html-results', (err) => {} );
		
		fs.emptyDir('./html-results', (err) => {} );
		fs.emptyDir('./html-results/screenshots/', (err) => {} );
		
		
		var jasmineReporters = require('jasmine-reporters');
		jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
			consolidateAll: true,
			savePath: './html-results',
			filePrefix: 'xmlresults'
		}));


		jasmine.getEnv().addReporter({
			specDone: function(result) {
				if (result.status == 'failed') {
					browser.getCapabilities().then(function(caps) {
						var browserName = caps.get('browserName');

						browser.takeScreenshot().then(function(png) {
							var stream = fs.createWriteStream('./html-results/screenshots/' + browserName + '-' + result.fullName + '.png');
							stream.write(new Buffer(png, 'base64'));
							stream.end();
						});
					});
				}
			}
		});
		*/
	},

	onComplete: function() {
		/*
		var browserName, browserVersion;
		var capsPromise = browser.getCapabilities();

		capsPromise.then(function(caps) {
			browserName = caps.get('browserName');
			browserVersion = caps.get('version');

			var HTMLReport = require('protractor-html-reporter');

			testConfig = {
				reportTitle: 'Test Execution Report',
				outputPath: './html-results',
				screenshotPath: 'screenshots',
				testBrowser: browserName,
				browserVersion: browserVersion,
				modifiedSuiteName: false,
				screenshotsOnlyOnFailure: true
			};
			new HTMLReport().from('./html-results/xmlresults.xml', testConfig);
		});
		*/
	}

};
