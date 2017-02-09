/* RAYTHEON PROPRIETARY
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

/**
 * A simple server for local SSV
 */
var path = require('path');
var express = require('express');
var http = require('http');
var fs = require('fs');

var assembly = require('./repository/assembly');
var favorite = require('./repository/favorite');

var app = express();

var server = http.createServer(app);


//setup mappings for ssv modules
app.use('/js', express.static(path.resolve(__dirname, './client')));
app.use('/', express.static(path.resolve(__dirname, './client')));
app.use('/pages/ssv', express.static(path.resolve(__dirname, './client')));

// fix for webjars...
app.use( '/webjars/common-client-assets/v1', express.static(path.resolve(__dirname, './client')));

//
////Setup mappings for third-party libraries
app.use('/angular', express.static(path.resolve(__dirname, 'node_modules/angular')));
app.use('/bootstrap', express.static(path.resolve(__dirname, 'node_modules/bootstrap/dist')));
app.use('/d3', express.static(path.resolve(__dirname, 'node_modules/d3')));
app.use('/jquery', express.static(path.resolve(__dirname, 'node_modules/jquery/dist')));
app.use('/angular-ui-router', express.static(path.resolve(__dirname, 'node_modules/angular-ui-router/release')));
app.use('/bootswatch', express.static(path.resolve(__dirname, 'node_modules/bootswatch')));
app.use('/font-awesome', express.static(path.resolve(__dirname, 'node_modules/font-awesome')));
app.use('/angular-ui-bootstrap', express.static(path.resolve(__dirname, 'node_modules/angular-ui-bootstrap')));
app.use('/angular-animate', express.static(path.resolve(__dirname, 'node_modules/angular-animate')));
app.use('/requirejs', express.static(path.resolve(__dirname, 'node_modules/requirejs')));

var supplierSmall = JSON.parse( fs.readFileSync('./data/raytheon-supplier-2.json' ) ); 
var supplier = JSON.parse( fs.readFileSync('./data/raytheon-supplier.json' ) );
console.log( 'Read supplier file' );

// set up routes for REST services
var router = express.Router();
app.use('/api/ssv-service', router);

function getMaterialBom( req, res ){assembly.queryMaterial(req.query.partNumber,req.query.partSite,req.query.assemblyNumber,req.query.assemblySite).then( (data) => res.json(data) );}

function getSupplierBom( req, res ){return (req.query.partNumber === '2278778-204')? res.json(supplier) : res.json(supplierSmall);	}

function getFavorites( req, res ){favorite.query().then( (data) => res.json(data) );}

// create the basic REST service for materials, suppliers, and favorites
router.route('/assembly/material').get( getMaterialBom ); 
router.route('/assembly/supplier').get( getSupplierBom );
router.route('/favorite').get( getFavorites  );
//TODO add put, post, & delete methods for favorites to support editing/adding/deleting

console.log( 'Set up routes' );

// start the server and listen on either the port/IP defined in your environment or
// on localhost:3000 if there arent any environment variables set
server.listen(process.env.SSV_PORT || 3000, process.env.SSV_IP || "localhost", function() {
  var addr = server.address();
  console.log("SSV Server listening at", addr.address + ":" + addr.port);
  console.log("SSV Server REST services exposed at", addr.address + ":" + addr.port + '/api/ssv-service' );
});
