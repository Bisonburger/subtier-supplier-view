# SSV Unit Testing
This is the unit testing for Sub-tier Supplier Visualization.  Unit tests are developed using the jasmine2 framework and are executed using the karma test runner.

## Setting up

From this directory:

1) Install the dependencies and install karma test runner globally:
```shell	
$ npm install
$ npm install karma -g 
```
    
2) Launch the unit tests from the Terminal:
```shell
$ npm test
```

This will run all of the unit tests and: 
* generate a code coverage report [(available under the coverage sub-directory)](./coverage/index.html)
* generate an html report for the tests [(available under the html-results sub-directory)](./html-results/./index.html)

## Installation details

### Required:
* [nodejs](https://nodejs.org/)
* npm (comes with nodejs)
* [karma (installed globally as above notes)](https://www.npmjs.com/package/karma)

	
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