define([], function() {
	return BOMTreeComponent;
});

var d3 = require('d3');
var angular = require('angular');

var BOMTreeComponent = {
	bindings : {
		minimap: '<?'
	},
	templateUrl : 'pages/ssv/components/bomTree/bom-tree-tmpl.html',
	controller : [ '$log', '$scope', '$rootScope', '$timeout', 'SSVConfig', 'AssemblySvc', BOMTreeController ],
};

/**
 * Controller for the BOMTree component
 */
function BOMTreeController($log, $scope, $rootScope, $timeout, ssvConfig, AssemblySvc) {
    var verticalSeparation = 160;
	var ctrl = this;
	
	ctrl.TRANSLATE = [ 700, 40 ];
    ctrl.$onInit = onInit;
    ctrl.updateTree = updateTree;
    ctrl.selectAssembly = selectAssembly;
    ctrl.expandAssembly = expandAssembly;
    ctrl.computePath = computePath;
    
    
    function _calcVerticalSeparation(){ return 160 + (Math.max( 0, ctrl.config.attributes.length-2)*20) };
                
    /**
     * Initialize the controller
     */
    function onInit() {
    	if( !ctrl.minimap ) ctrl.minimap = false;
    	
    	ctrl.scale = 1;
    	
    	if( ctrl.minimap )
            $scope.$on('bomTreeViewChanged', handleChangedView);
    	
        $scope.$on('bomTreeRootChanged', handleChangedRoot);
        $scope.$on('bomTreeConfigChanged', handleConfigChanged );
        $scope.$on('bomFilterChanged', handleFilterChanged );
        $scope.$on('bomTreeExpandAll', handleExpandCollapseAll );
        $scope.$on('bomTreeCollapseAll', handleExpandCollapseAll );
        $scope.$on('bomTreeZoom', handleZoomToAssembly );

        // default BOM Tree configuration
        ctrl.config = {
        		showSwimlanes: true,
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

    	ctrl.translate = ctrl.TRANSLATE;

        ctrl.tree = d3.layout.tree().nodeSize([250, 20]);

        ctrl.diagonal = d3.svg.diagonal().projection( function(d){ return [d.x, d.y]; });
        
        $scope.$watch(function(){return ctrl.root; }, updateTree );
        
        if( !ctrl.minimap ){
        	ctrl.zoomListener = d3.behavior.zoom().scaleExtent([0.1,3]).on("zoom", handleZoom );
        	d3.select("#svgContent").call(ctrl.zoomListener);
        }
        
    }
    
    function centerNode(assembly) {
//    	scale = ctrl.zoomListener.scale();
        scale = 1;
        x = -assembly.x;
        y = -assembly.y;
        x = (x * scale + ctrl.width / 2) + 125;
        y = y * scale + ctrl.height / 2;
        d3.select('#svgGroup').transition().duration(500).attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        ctrl.zoomListener.scale(scale);
        ctrl.zoomListener.translate([x, y]);
    	if( !ctrl.minimap ) $rootScope.$broadcast( 'bomTreeViewChanged', { 'translate': [x,y], 'scale': scale } );    	
    }
    
    function computePath(path){    	
    	var halfWay = Math.ceil(_calcVerticalSeparation()/2);
    	return "M" + path.source.x + " " + path.source.y + ' v ' + halfWay + ' H '+  path.target.x + ' v ' + halfWay;
    };
    
    function handleChangedView( event, opts ){
    	$timeout(function(){
    		ctrl.translate = opts.translate;
    		ctrl.scale = opts.scale;
    	});
    }
    
    /**
     * Callback/Handler for the zoom event
     */
    function handleZoom(){
    	if( ctrl.minimap ) return;
    	_zoom( d3.event.translate, d3.event.scale );    	
    }
    
    function handleZoomToAssembly(event,opts){
    	if( ctrl.minimap || !opts || !opts.assembly ) return;
    	
    	if(_findNodeById(opts.assembly.id)){
    		centerNode(opts.assembly);
    		selectAssembly( opts.assembly );
    	} else {
    		var foundNode = findNode(ctrl.root, opts.assembly.id);
    		
    		if(foundNode){
    			var pathNodes = pathToRoot(foundNode);
    			
    			if(pathNodes.length > 0){
    				expandToNode(ctrl.root, foundNode, pathNodes);
    				updateTree(foundNode);
    				selectAssembly(foundNode );
    			}    			
    		}
    	}
    	
    }
    
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
    
    function _zoom( translateFactor, scaleFactor ){    	
    	var svgGrp = d3.select( "#svgGroup");    	    	    
    	if( !ctrl.minimap ) $rootScope.$broadcast( 'bomTreeViewChanged', { 'translate': translateFactor, 'scale': scaleFactor } );    	
    	svgGrp.attr( "transform", "translate(" + translateFactor + ") scale ( " + scaleFactor + " )" );    	
    }
            
    /**
     * Callback/Handler for the change of root event 
     */
    function handleChangedRoot(event, opts) {
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
    };
    
    function handleConfigChanged( event, config ){
    	ctrl.config = config;
    	updateTree();
    }
    
    function handleFilterChanged( event, filter ){
    	ctrl.filter = filter;
    	updateTree();
    }
    
    function handleExpandCollapseAll( event ){
    	if( ctrl.minimap ) return;
    	_expandCollapse( ctrl.root, (event.name === "bomTreeExpandAll") );
    	updateTree();
    }
    
    function _expandCollapse( root, expand ){
    	if( expand ){
    		if( root._children && root._children.length > 0 )
    			root.children = root._children;
    		root._children = null;
    		angular.forEach( root.children, function(child){ _expandCollapse(child,true);} );
    	} else{
    		if( root.children  && root.children.length > 0 )
    			root._children = root.children;
    		root.children = null;
    		angular.forEach( root._children, function(child){ _expandCollapse(child,false);} );
    	}
    }

    /**
     * Search for a node in from the specified root
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
        return null;
    };

    /**
     * Generate a path (Array of nodes) from the specified node to the root of the tree
     */
    function pathToRoot(fromNode) {
    	if( !fromNode ) return [];
    	
        var path = [];
        var node = fromNode;
        while(node){
        	path.push( node );
        	node = node.parent;
        };
        return path;
    };
    
    /**
     * Callback/Handler for selection of an assembly
     */
    function selectAssembly(assembly){
        ctrl.assembly = assembly;
        $rootScope.$broadcast( 'bomTreeNodeSelected', { assembly: assembly, pathToRoot: pathToRoot(assembly) } );
    }
    
    function expandAssembly(assembly){
        if( assembly.children ){
        	assembly._children = assembly.children;
        	assembly.children = null;
        }
        else{
        	assembly.children = assembly._children;
        	assembly._children = null;
        }
        updateTree(assembly);        
    };
    
    function depthsShowing(root){
    	if( !root ) root = ctrl.root;
    	if( !root.children || root.children.length === 0 ) return 0;
    	else{    		
    		var maxDepthOfChildren = -Infinity;
    		angular.forEach( root.children, function(child){maxDepthOfChildren = Math.max( depthsShowing(child), maxDepthOfChildren );});
    		return 1 + maxDepthOfChildren;
    	}    	
    }
    
    
    function minLeftExtentShowing(root,min){
    	if( !root ) root = ctrl.root;
    	if( !min ) min = Infinity;
    	if( !root.children ) return Math.min( min, root.x );
    	else{
    		angular.forEach( root.children, function(child){ min = Math.min( minLeftExtentShowing( child, min ), min ); } );
    		return min;
    	}    	
    }
    
    function maxRightExtentShowing(root,max){
    	if( !root ) root = ctrl.root;
    	if( !max ) max = -Infinity;
    	if( !root.children ) return Math.max( max, root.x );
    	else{
    		angular.forEach( root.children, function(child){ max = Math.max( maxRightExtentShowing( child, max ), max ); } );
    		return max;
    	}    	
    }
        
    function buildSwimlanes(){
        var swimlanes = [];
        var mles = minLeftExtentShowing();
        var mres = maxRightExtentShowing();
        var depths = depthsShowing();
        
        var y = -30;
        var height = _calcVerticalSeparation();
        var vpadding = 10;
        var hpadding = 100;
        
        swimlanes.push( {x: mles - (hpadding*2), y: y, width: (mres+(2*hpadding))-(mles-(2*hpadding)), height: (height-vpadding) } );
        
        while( depths-- ){
        	swimlanes.push( {x: mles - (hpadding*2), y: y += height, width: (mres+(2*hpadding))-(mles-(2*hpadding)), height: (height-vpadding) } );
        }
        return swimlanes;
    }
    
    
    function matchFilter( node, filter ){
    	var partmatch = (node.partNumber === filter.partNumber);
    	var keys = (filter.selected)? Object.keys(filter.selected) : [];    	
    	var attrMatches = keys.filter( function(attribute){ return node[attribute] === filter.selected[attribute]; } );    	
    	var attrmatch = (keys.length > 0 && keys.length === attrMatches.length );

		return ( filter.partNumber && keys.length > 0 )? partmatch && attrmatch :
			   ( filter.partNumber && keys.length === 0 )? partmatch :
			   ( !filter.partNumber && keys.length > 0 )? attrmatch : false;
    	
    }
    
    function _findNodeById( id ){
    	var node = null;
    	angular.forEach( ctrl.nodes, function(n){ if( n.id === id ) node = n;} );
    	return node;
    }
    
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
    
    function _applyFiltering(node){
    	node.highlighted = false;
    	node.greyed = false; 
    	
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
    }
    
    /**
     * Redraw the tree
     */
    function updateTree(assembly) {    	
    	if( !ctrl.root ) return;

    	$timeout( function(){
	        ctrl.nodes = ctrl.tree.nodes(ctrl.root).reverse();
	        ctrl.edges = ctrl.tree.links(ctrl.nodes);
	        ctrl.swimlanes = ( ctrl.config.showSwimlanes )? buildSwimlanes() : [];
	        ctrl.nodes.forEach( function(node,index){	        	
	        	typeof node.id === 'undefined' && (node.id = index); // if the node doesnt have an id; give it one 
	    		_updateNodeColor( node ); // set the node's color
	    		_applyFiltering( node ); // apply any filtering	        	
	        	node.y = node.depth * _calcVerticalSeparation(); 
	        });
	        
	        if(assembly){
	        	centerNode(assembly);
	        }
    	});
    };
}