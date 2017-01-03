> *WARNING:*  Running ssv local is currently not functioning due to some breaking changes.
> It should be up and running shortly.

# SSV Local Server

This is a local setup for Sub-tier Supplier Visualization that does not require RA5 or other servers/services

## Setting up

From this directory:

1) Install the dependencies:
    
    $ npm install
    
2) Launch the app from the Terminal:

    $ npm start

Once the server is running, open a browser and point to http://localhost:3000.

To change the port number, define an environment variable `SSV_PORT` and set it to the desired value.  Likewise, to change the IP of the service, define
an environment variable `SSV_IP` and set it to the domain name or IP of the service.

Data is being served from the [data/data.xlsx](./data/data.xlsx) file for favorites and material view and from the [data/raytheon-supplier-2.json](./data/raytheon-supplier2.json) file for supplier data.  
Favorites and Material view data is dynamic (that is, you can change the xlsx file and refresh to see the data change).  For supplier data this is 'pre-cached' in the server - meaning any changes require a restart of the server.

## Installation details 

### Required:
* [nodejs](https://nodejs.org/)
* npm (comes with nodejs)

### Installed by npm:
* [angular 1.5.8](https://www.npmjs.com/package/angular)
* [angular-animate 1.5.8](https://www.npmjs.com/package/angular-animate)
* [angular-ui-bootstrap 0.14.3](https://www.npmjs.com/package/angular-ui-bootstrap)
* [bootstrap 3.3.7](https://www.npmjs.com/package/bootstrap)
* [d3 3.5.17](https://www.npmjs.com/package/d3)
* [font-awesome 4.6.3](https://www.npmjs.com/package/font-awesome)
* [jquery 2.2.4](https://www.npmjs.com/package/jquery)
* [requirejs 2.3.2](https://www.npmjs.com/package/requirejs)
* [express 4](https://www.npmjs.com/package/express)

> Note that other packages (namely the dependencies of these packages) will be installed and appear under node_modules.

## Making SSV fully self-contained
SSV is "mostly" self-contained with the following exceptions:

1) CSS files:  ssv needs the css files under src/main/resources/static/css; you could copy them to a local/css directory to be fully self contained with css files

2) ngSlideout module:  the angular module under src/main/resources/static/js/angularjs-directives/ngSidebar.js is required by ssv; to make this fully self contained - move it to local and change its path in local-requirejs-config.js:
	
from
 
	'ngSidebar': 'js/angularjs-directives/ngSidebar'
	
to
	
	'ngSidebar': 'ngSidebar'
	
## Behind the corporate firewall
If you are behind the corporate firewall, you may have to set up npm to play nice with the proxy (unless you've already done so)

	$ npm set https-proxy http://tus-proxy.ext.ray.com:80
	$ npm set proxy http://tus-proxy.ext.ray.com:80
	$ npm set registry http://registry.npmjs.org/
	$ npm set strict-ssl false

To verify that everything is set

	$ npm config list
