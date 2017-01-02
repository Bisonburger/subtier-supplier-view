//
// # SimpleServer
//
var http = require('http');
var path = require('path');
var express = require('express');
var fs = require('fs');

var app = express();
var server = http.createServer(app);

// Setup mappings for third-party libraries
app.use('/', express.static(path.resolve(__dirname, 'client')));
app.use('/pages/ssv', express.static(path.resolve(__dirname, 'client')));
app.use('/layout/loading', express.static(path.resolve(__dirname, 'client')));
app.use('/js', express.static(path.resolve(__dirname, 'client')));
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


var router = express.Router();
app.use('/api/ssv-service', router);

var material = JSON.parse( fs.readFileSync('./raytheon-material-2.json') ); 

var supplier = JSON.parse( fs.readFileSync('./raytheon-supplier-2.json' ) ); 

var favorites = JSON.parse( fs.readFileSync('./favorites.json' ) );

// set up routes for REST services
router.route('/assembly/material')
  .get( (req, res) => res.json(material) );

router.route('/assembly/supplier')
  .get( (req, res) => res.json(supplier) );

router.route('/favorite')
  .get( (req, res) => res.json(favorites) );




server.listen(process.env.PORT || 3000, process.env.IP || "127.0.0.1", function() {
  var addr = server.address();
  console.log("SSV Server listening at", addr.address + ":" + addr.port);
  console.log("SSV Server REST services exposed at", addr.address + ":" + addr.port + '/api/ssv-service' );

});