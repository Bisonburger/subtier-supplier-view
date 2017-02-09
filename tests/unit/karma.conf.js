/**
 * Karma configuration file for unit testing of SSV
 */
module.exports = function(config) {
  config.set({

    /*
     * Point Karma's base directory to src/main/resources/static
     * This is what would be served from the web when deployed
     */
    basePath: '../../../..',

    /*
     * Use jasmine & requirejs
     */
    frameworks: ['jasmine', 'requirejs'],

    /*
     * All we really need is the requirejs configuration; tell karma not to 
     * serve anything but that - we'll let require serve up the files
     */
    files: [
      'pages/ssv/tests/unit/karma-requirejs-config.js', {
        pattern: '**/*.js',
        included: false
      }
    ],

    // exclude some files/patterns 
    exclude: [
      'pages/ssv/local/**/*.js', // ignore things in the local directory
      'pages/ssv/tests/e2e/*.js'  // ignore e2e test in unit testing
    ],

    // use progress and coverage to report the results
    reporters: ['progress', 'coverage', 'html'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_ERROR,
    autoWatch: false,
    browsers: ['IE_no_addons'],
    
    customLaunchers: {
      IE_no_addons: {
        base: 'IE',
        flags: ['-extoff']
      }  
    },

    // one run and done; vs run continuously
    singleRun: true,

    // configure the coverage pre-processor to only look at the developed files (vs tests, etc.)
    preprocessors: {
      'pages/ssv/components/**/*-component.js': ['coverage'],
      'pages/ssv/services/*-service.js': ['coverage']
    },

    // setup the coverage reporter to output html to the coverage subdirectory
    coverageReporter: {
      type: 'html',
      dir: 'pages/ssv/tests/unit/coverage',
      subdir: '.',
      includeAllSources: true
    },
    
    htmlReporter: {
      outputDir: 'html-results'
    }
  });
};
