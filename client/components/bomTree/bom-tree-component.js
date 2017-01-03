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

define([], function() {return BOMTreeComponent;});

var angular = require('angular');
var d3 = require('d3')

/**
 * Definition of the BOMTree component
 * 
 * @name bomTree
 * @module ssv.components
 * 
 */
var BOMTreeComponent = {
	bindings : {
		nodes: '=',
		edges: '=',
		swimlanes: '=',
		minimap: '<?',
		isLoaded: '='
	},
	templateUrl : 'pages/ssv/components/bomTree/bom-tree-tmpl.html',
	controller : [ '$log', '$scope', '$rootScope', '$timeout', '$window', 'LocalStorageSvc', 'SSVConfig', 'AssemblySvc', BOMTreeController ],
};

/**
 * Controller for the BOMTree component
 * 
 * @name BOMTreeController
 * @param {service} $log AngularJS log service
 * @param {service} $scope AngularJS current scope service
 * @param {service} $rootScope AngularJS rootScope service
 * @param {service} $timeout AngularJS timeout service
 * @param {SSVConfig} ssvConfig SSV configuration constants
 * @param {AssemblySvc} AssemblySvc SSV Assembly service
 * 
 */
function BOMTreeController($log, $scope, $rootScope, $timeout, $window, $localStorage, ssvConfig, AssemblySvc) {
	
	/** @var {number} default vertical separation between nodes */
    var verticalSeparation = 160;
    
    /** @alias this */
	var ctrl = this;
	
    /** Controller initializer @function @see onInit @public */
	ctrl.$onInit = onInit;
	
	/** Redraw the tree @function @see updateTree @public */
    ctrl.updateTree = updateTree;
    
    /** Select a given assembly @function @see selectAssembly @public */
    ctrl.selectAssembly = selectAssembly;
    
    /** Expand/contract an assembly @function @see expandAssembly @public
     */
    ctrl.expandAssembly = expandAssembly;
    
    /** Compute the SVG path to draw between nodes @function @see computePath @public */
    ctrl.computePath = computePath;    
    
    
    ctrl.setupDownload = function(){
    	//get svg element.
    	var svg = d3.select("#svgContent");
    	
    	console.log( svg[0][0] );

    	//get svg source.
    	var serializer = new $window.XMLSerializer();
    	var source = serializer.serializeToString(svg[0][0]);

    	//add name spaces.
    	if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
    	    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    	}
    	if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
    	    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    	}

    	//add xml declaration
    	source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    	//convert svg source to URI data scheme.
    	var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

    	//set url value to a element's href attribute.
    	ctrl.downloadLink = url;
    	//you can download svg file by right click menu.	
    };
    
    ctrl.downloadLink = "#";
    /**
     * Calculate the vertical separation between nodes.  Separation is based on the
     * number of attributes showing within the node (with a minimum)
     * 
     * @note the node "anchor point" is the upper left corner
     */
    function _calcVerticalSeparation(){ return 160 + (Math.max( 0, ctrl.config.attributes.length-2)*20); }
                
    /**
     * Initialize the controller
     * 
     * @private
     */
    function onInit() {
    	if( !ctrl.minimap ) ctrl.minimap = false;
    	
    	ctrl.scale = 1;
    	
    	ctrl.zoomScale = 1;
    	
    	if( ctrl.minimap )
            $scope.$on('bomTreeViewChanged', handleChangedView);
    	
        // initialize the filters to material view...
        ctrl.filter = JSON.parse($localStorage.get( 'ssv-material-filters' )) || [];
    	
        $scope.$on('bomTreeRootChanged', handleChangedRoot);
        $scope.$on('bomTreeConfigChanged', handleConfigChanged );
        $scope.$on('bomFilterChanged', handleFilterChanged );
        $scope.$on('bomTreeExpandAll', handleExpandCollapseAll );
        $scope.$on('bomTreeCollapseAll', handleExpandCollapseAll );
        $scope.$on('bomTreeZoom', handleZoomToAssembly );

        // default BOM Tree configuration
        ctrl.config = {
        		showSwimlanes: true,
        		showWatermark: true,
        		attributes: [ "partNumber", "partSite"],
        		isScheduleView: true,
        		isMaterialView: true
        };
        
        ctrl.margin = {
                top: 40,
                right: 120,
                bottom: 20,
                left: 120
            };
            
        ctrl.width = 1000 - ctrl.margin.right - ctrl.margin.left;
        ctrl.height = 500 - ctrl.margin.top - ctrl.margin.bottom;

    	ctrl.translate = [500,100];

        ctrl.tree = d3.layout.tree().nodeSize([250, 20]);

        ctrl.diagonal = d3.svg.diagonal().projection( function(d){ return [d.x, d.y]; });
        
        
        $scope.$watch(function(){return ctrl.root; }, updateTree );
        
        if( !ctrl.minimap ){
        	ctrl.zoomListener = d3.behavior.zoom().scaleExtent([0.1,3]).on("zoom", handleZoom );
        	d3.select("#svgContent").call(ctrl.zoomListener);
        }
    	ctrl.isLoaded = true;        
    }
    
    
    /**
     * Center the given node/assembly on the screen
     * 
     * @private
     * @param {Assembly} assembly The node/assembly to center
     */
    function centerNode(assembly) {
    	if( ctrl.minimap ) return;
        var scale = 1;
        var x = -assembly.x;
        var y = -assembly.y;
        x = (x * scale + ctrl.width / 2) + 125;
        y = y * scale + ctrl.height / 2;
        d3.select('#svgGroup').transition().duration(500).attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        ctrl.zoomListener.scale(scale);
        ctrl.zoomListener.translate([x, y]);
        $rootScope.$broadcast( 'bomTreeViewChanged', { 'translate': [x,y], 'scale': scale } );
    }
    
    /**
     * Computes the SVG line/path between two nodes
     * 
     * @param {Path} path Path object representing the source and target of the path
     * @returns {String} The SVG line representation of the path between the nodes
     */
    function computePath(path){    	
    	var halfWay = Math.ceil(_calcVerticalSeparation()/2);
    	return "M" + path.source.x + " " + path.source.y + ' v ' + halfWay + ' H '+  path.target.x + ' v ' + halfWay;
    }
    
    /**
     * Handler for the bomTreeViewChanged event; sets the translate/scale for the change
     * 
     * @private
     * @param {Event} event Event object that triggered the handler
     * @param {{translate: Array, scale: number}} opts The data passed with the event; has a translate and scale member
     */
    function handleChangedView( event, opts ){
    	$timeout( function(){
    		ctrl.translate = opts.translate;
    		ctrl.scale = opts.scale;
    	});
    }
    
    /**
     * Handler for the zoom event (triggered within D3)
     * 
     *  @private
     */
    function handleZoom(){
    	if( ctrl.minimap ) return;
    	_zoom( d3.event.translate, d3.event.scale );    	
    }
    
    /**
     * Handler for the bomTreeZoom event
     * Note: only used by the minimap
     * 
     * @private
     * @param {Event} event Event object that triggered the handler
     * @param {{assembly: Assembly}} opts The data passed with the event; has an assembly member for the assembly to zoom to
     */
    function handleZoomToAssembly(event,opts){
    	if( ctrl.minimap || !opts || !opts.assembly ) return;
    	
    	if(_findNodeById(opts.assembly.id)){
    		centerNode(opts.assembly);
    		selectAssembly( opts.assembly );
    	} else {
    		var foundNode = findNode(ctrl.root, opts.assembly.id);
    		
    		if(foundNode){
    			var pathNodes = pathToRoot(foundNode, false);
    			
    			if(pathNodes.length > 0){
    				expandToNode(ctrl.root, foundNode, pathNodes);
    				updateTree(false, foundNode);
    				selectAssembly(foundNode );
    			}    			
    		}
    	}
    	
    }
    
    /**
     * Expands all the nodes between a root and a target
     * 
     * @private
     * @param {Assembly} root
     * @param {Assembly} target
     * @param {{source:Assembly,target:Assembly}[]} pathNodes
     */
    function expandToNode(root, target, pathNodes){
    	if(root.id !== target.id){
    		if(root._children && root._children.length > 0){
    			root.children = root._children;
    			root._children = null;
    		}
    		
    		angular.forEach(root.children, function(child){
				angular.forEach(pathNodes, function(pathNode){
					if(pathNode.id === child.id){
						expandToNode(child, target, pathNodes);
					}
				});
    		});
    	}
    }
    
    /**
     * Zooms the display to a particular translation/position and scale factor
     * 
     * @private
     * @param {Array} translateFactor 2-element array for the X and Y position shift
     * @param {number} scaleFactor scaling factor 
     */
    function _zoom( translateFactor, scaleFactor ){        	    
    	var svgGrp = d3.select( "#svgGroup");    	    	    
    	if( !ctrl.minimap ) $rootScope.$broadcast( 'bomTreeViewChanged', { 'translate': translateFactor, 'scale': scaleFactor } );    	
    	svgGrp.attr( "transform", "translate(" + translateFactor + ") scale ( " + scaleFactor + " )" );    	
    }
            
    
    /**
     * Handler for the bomTreeRootChanged event
     * 
     * @private
     * @param {Event} event Event object that triggered the handler
     * @param {{assembly: Assembly}} opts The data passed with the event; 
     */
    function handleChangedRoot(event, opts) {
    	if(opts.resetTree){
    		ctrl.root = ctrl.originalRoot;
    	} else {
    		if(!ctrl.originalRoot){
    			ctrl.originalRoot = angular.copy( opts.assembly );	
    		}
    		
    		if(opts.replaceTree){
    			ctrl.root = opts.assembly;	
    		} else {
    			var newRoot = findNode( ctrl.originalRoot, opts.assembly.id);
    			if( newRoot ) ctrl.root = newRoot;
    			else $log.debug( "Unable to find the root in the original" );    		
    		}
    		
    		if( ctrl.root ) selectAssembly( ctrl.root );
    	}
    }
    
    /**
     * Handler for the bomTreeConfigChanged event
     * 
     * @private
     * @param {Event} event Event object that triggered the handler
     * @param {Object} opts The data passed with the event; the changed BomTree configuration
     */
    function handleConfigChanged( event, config ){
    	ctrl.config = config;
    	updateTree(true);
    }
    
    function handleFilterChanged( event, filter ){
    	ctrl.filter = filter;
    	updateTree(false);
    }
    
    function handleExpandCollapseAll( event ){
    	if( ctrl.minimap ) return;
    	//_safeSetLoaded( false );
    	
    	_expandCollapse( ctrl.root, (event.name === "bomTreeExpandAll") );
    	updateTree(true);
    	//_safeSetLoaded( true );
    }
    
    function _expandCollapse( root, expand ){
    	if( expand ){
        	if( !root.children ){
        		root.children = root._children;
        		root._children = null;
        	}
    		if( root.children && root.children.length > 0) angular.forEach( root.children, function(child){ _expandCollapse(child,true);} );
    	} else{
        	if( !root._children ){
        		root._children = root.children;
        		root.children = null;
        	}
    		if( root._children && root._children.length > 0) angular.forEach( root._children, function(child){ _expandCollapse(child,false);} );
    	}
    }

    /**
     * Search for a node in from the specified root
     * 
     * @private
     * @param {Assembly} element Root node to start search from
     * @param {string} element id to search for
     * @returns {Assembly|null} The node in the subtree starting at element that has the given id (null if none was found)
     */
    function findNode(element, id) {
        if (element.id === id) {
            return element;
        } else {
            var i, k;            
            var result = null;
            
            if (element.children != null){
            	for (i = 0; result == null && i < element.children.length; i++) {
            		result = findNode(element.children[i], id);
            	}            	
            }
            if (element._children != null){
            	for (k = 0; result == null && k < element._children.length; k++) {
            		result = findNode(element._children[k], id);
            	}            	
            }
            return result;
        }
    }

    /**
     * Generate a path (Array of nodes) from the specified node to the root of the tree
     * 
     * @private
     * @param {Assembly} element to start the path to root from
     * @return {Assembly} array of assemblys from the node to the root; may be empty
     */
    function pathToRoot(fromNode, useNodes) {
    	var path = [];
    	
    	if(useNodes){
    		if( !fromNode ) return [];
    		
    		var node = fromNode;
    		while(node){
    			path.push( node );
    			node = (node === ctrl.root)? null : node.parent;
    		}   		
    	} else {
            var parent;
            var parentId = fromNode.parentId;
            do {
            	parent = null;
            	
            	if(parentId){
            		parent = findNode(ctrl.originalRoot, parentId);
            		parentId = parent.parentId;
            	}
            	
                parent && path.push(parent);
            } while (parent != null);
    	}
        return path;
    }
    
    /**
     * Callback/Handler for selection of an assembly
     */
    function selectAssembly(assembly){
        ctrl.assembly = assembly;
        $rootScope.$broadcast( 'bomTreeNodeSelected', { assembly: assembly, pathToRoot: pathToRoot(assembly, true) } );
    }
    
    function expandAssembly(assembly){
        if( assembly._children ){
        	if( !assembly.children ){
        		assembly.children = assembly._children;
        		assembly._children = null;
        	}
        } else {
        	if( !assembly._children ){
        		assembly._children = assembly.children;
        		assembly.children = null;
        	}
        }
        updateTree(false, assembly);  
        selectAssembly(assembly);
    }
    
    /**
     * Calculates the current depth showing from the specified root; the tree root if no root is supplied
     * 
     * @private
     * @param {Assembly} [root=ctrl.root] node to start the depth count from
     * @return {number} depth of the tree from the root; a single node has depth 0
     */
    function depthsShowing(root){
    	if( !root ) root = ctrl.root;
    	if( !root.children || root.children.length === 0 ) return 0;
    	else{    		
    		var maxDepthOfChildren = -Infinity;
    		angular.forEach( root.children, function(child){maxDepthOfChildren = Math.max( depthsShowing(child), maxDepthOfChildren );});
    		return 1 + maxDepthOfChildren;
    	}    	
    }
    
    /**
     * Calculates the smallest x value of any nodes being shown in the tree
     * 
     * @private
     * @param {Assembly} [root=ctrl.root] to start the calculation from
     * @param {number} [min=Infinity] current minimum value
     * @returns {number} smallest x value of any nodes shown
     */
    function minLeftExtentShowing(root,min){
    	if( !root ) root = ctrl.root;
    	if( !min ) min = Infinity;
    	if( !root.children ) return Math.min( min, root.x );
    	else{
    		angular.forEach( root.children, function(child){ min = Math.min( minLeftExtentShowing( child, min ), min ); } );
    		return min;
    	}    	
    }
    
    /**
     * Calculates the largest x value of any nodes being shown in the tree
     * 
     * @private
     * @param {Assembly} [root=ctrl.root] to start the calculation from
     * @param {number} [max = -Infinity] current maximum value
     * @returns {number} largest x value of any nodes shown
     */
    function maxRightExtentShowing(root,max){
    	if( !root ) root = ctrl.root;
    	if( !max ) max = -Infinity;
    	if( !root.children ) return Math.max( max, root.x );
    	else{
    		angular.forEach( root.children, function(child){ max = Math.max( maxRightExtentShowing( child, max ), max ); } );
    		return max;
    	}    	
    }
        
    /**
     * Construct the values required to build/display the swimlanes
     * 
     * @private
     * @returns {{x:number, y:number, width:number, height:number}[]} array of objects used to build the swimlanes 
     */
    function buildSwimlanes(){
        var swimlanes = [];
        var mles = minLeftExtentShowing();
        var mres = maxRightExtentShowing();
        var depths = depthsShowing();
        
        var y = -40;
        var height = _calcVerticalSeparation();
        var vpadding = 10;
        var hpadding = 100;
        
        swimlanes.push( {x: mles - (hpadding*2), y: y, width: (mres+(2*hpadding))-(mles-(2*hpadding)), height: (height-vpadding) } );
        
        while( depths-- ){
        	swimlanes.push( {x: mles - (hpadding*2), y: y += height, width: (mres+(2*hpadding))-(mles-(2*hpadding)), height: (height-vpadding) } );
        }
        return swimlanes;
    }
    
    /**
     * Determine if the given filter is a match for the node
     * 
     * @private
     * @param {Assembly} node/assembly to match against
     * @param {{partNumber:string,selected<attribute:string,value:string>}} filter to match against
     * @returns {boolean}  true if the filter is a match; false otherwise
     */
    function matchFilter( node, filter ){
    	if( filter.partNumber && filter.partNumber.length === 0 ) filter.partNumber = null;
    	var partmatch = (node.partNumber === filter.partNumber);
    	var keys = (filter.selected)? Object.keys(filter.selected).filter(function(key){ return filter.selected[key] && filter.selected[key].length > 0;}) : [];    	
    	var attrMatches = keys.filter( function(attribute){ return node[attribute] === filter.selected[attribute]; } );    	
    	var attrmatch = (keys.length > 0 && keys.length === attrMatches.length );

		return ( filter.partNumber && keys.length > 0 )? partmatch && attrmatch :
			   ( filter.partNumber && keys.length === 0 )? partmatch :
			   ( !filter.partNumber && keys.length > 0 )? attrmatch : false;    	
    }
    
    /**
     * Finds a given node by its id attribute; with no regard to showing/not-showing
     * 
     * @private
     * @param {string} id ID to search for
     * @returns {Assembly} matching node/assembly; null if not found
     */
    function _findNodeById( id ){
    	var node = null;
    	angular.forEach( ctrl.nodes, function(n){ if( n.id === id ) node = n;} );
    	return node;
    }
    
    /**
     * Set the proper color of the node; sets the color attribute of this passed node/assembly
     * 
     * @private
     * @param {Assembly} node node/assembly to set the color of (based on view/status)
     */
    function _updateNodeColor( node ){
    	if(ctrl.config.isMaterialView){
    		if(ctrl.config.isSpcView){
    			node.color = node.getColor('spc');	        			
    		} else if(ctrl.config.isQnoteView){
    			node.color = node.getColor('qnote');
    		} else if(ctrl.config.isScheduleView){
    			node.color = node.getColor('schedule');
    		} else {
    			node.color = 'no-data';
    		}
    	} else {
    		if(ctrl.config.isSpcView){
    			node.color = node.getWorstCaseColor('spc');	        			
    		} else if(ctrl.config.isQnoteView){
    			node.color = node.getWorstCaseColor('qnote');
    		} else if(ctrl.config.isScheduleView){
    			node.color = node.getWorstCaseColor('schedule');
    		} else {
    			node.color = 'no-data';
    		}
    	}
    	
    }
    
    /**
     * Applies all filters to the given node
     *
     * @private
     * @param {Assembly} node/assembly to match against
     */
    function _applyFiltering(node){
    	
    	if( !node.isDisplayed() ) return; 
    	
    	node.highlighted = false;
    	node.greyed = false; 
    	
    	//_safeSetLoaded( false );
    	ctrl.isLoaded = false;
    	angular.forEach( ctrl.filter, function(filter){ 
    		if( filter.active ){
            	if( filter.selectType === 'highlight' ){
            		var match = matchFilter( node, filter );
            		node.highlighted = node.highlighted ||  match;
            		node.greyed = node.greyed || false;
            		
            		if( match ) node.highlightColor = filter.selectedColor;
            	}
            	else{
            		node.greyed = node.greyed || !matchFilter( node, filter );
            		node.highlighted = node.highlighted || false;
            	}        		
    		}
    	});
    	//_safeSetLoaded( true );

    }
    
    /**
     * Redraw the tree
     * 
     * @param {Assembly} [assembly] node/assembly to center the redrawn tree around
     */
    function updateTree(showLoading, assembly) {    	
    	if( !ctrl.root ) return;
    	
    	if( ctrl.minimap ) return; // as the minimap, we dont need to do all this; its been done already
    	
    	if(showLoading){
    		ctrl.isLoaded = false;    		
    	}
    	$timeout( function(){
	        ctrl.nodes = ctrl.tree.nodes(ctrl.root).reverse();
	        ctrl.edges = ctrl.tree.links(ctrl.nodes);
	        ctrl.swimlanes = ( ctrl.config.showSwimlanes )? buildSwimlanes() : [];
	        var vertSep = _calcVerticalSeparation();
    		ctrl.nodes.forEach( function(node,index){
    			typeof node.id === 'undefined' && (node.id = index); // if the node doesnt have an id; give it one 
    			_updateNodeColor( node ); // set the node's color
    			_applyFiltering( node ); // apply any filtering	        	
    			node.y = node.depth *  vertSep;
    		});
    		if(assembly){centerNode(assembly);}
    		ctrl.isLoaded = true;
    	}, 0);
    }
}