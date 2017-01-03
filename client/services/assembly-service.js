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
define([], function() { return [ '$http', 'ENDPOINTS', AssemblyService ]; });

var angular = require( 'angular' );

/**
 * Defines the AssemblyService; This service is a factory for creating Assembly objects
 * and provides simple functions to query the REST service for Assemblies
 * 
 * @name AssemblySvc
 * @module ssv.services
 *  
 * @param {service} $http AngularJS service to access REST services
 * @param {constants} ENDPOINTS RefApp5 constants for system endpoints
 */
function AssemblyService($http, ENDPOINTS) {
	/** @var Base URL for the Assembly REST Service */
	var URL = ENDPOINTS["ssv"] + "/assembly";
	
    /**
     * Constructor for an Assembly object
     * Assembly objects maintain data and functionality for a node/assembly
     * 
     * @constructor
     * @param {Object} [opts] Parent/base class/data for an AssemblyObject
     */
	function Assembly(opts){
		/** @alias this */
        var assembly = this;
        
        angular.extend( assembly, opts );   
        
        /**
         * Determines the color of the node
         * 
         * @param {string} colorIndicatorType type of the color indicator; schedule, spc, qnote (unknown defaults to qnote)
         * @returns color string for the nodes color; one of red, yellow, green
         */
        assembly.getColor = function(colorIndicatorType){
        	
        	var field = (colorIndicatorType === 'schedule')? 'scheduleStatus' : 
        					(colorIndicatorType === 'spc')? 'spcStatus' : 'qnoteStatus';
        	
        	return (assembly[field] === 'R')? 'red' : 
        		(assembly[field] === 'Y')? 'yellow' :
        			(assembly[field] === 'G')? 'green' : 'no-data';
        };
        
        /**
         * Determines the worst case color for the node
         * 
         * @param {string} colorIndicatorType type of color indicator; schedule, spc, qnote (unknown defaults to qnote)
         * @returns color string for the worst case color; one of red, yellow, green
         */
        assembly.getWorstCaseColor = function(colorIndicatorType){
        	if(colorIndicatorType == 'schedule'){
        		return assembly.scheduleStatusWorstCase === 'R' ? 'red' : assembly.scheduleStatusWorstCase === 'Y' ? 'yellow': assembly.scheduleStatusWorstCase === 'G' ? 'green' : 'no-data';        		
        	} else if (colorIndicatorType == 'spc'){
        		return assembly.spcStatusWorstCase === 'R' ? 'red' : assembly.spcStatusWorstCase === 'Y' ? 'yellow': assembly.spcStatusWorstCase === 'G' ? 'green' : 'no-data';
        	} else {
        		return assembly.qnoteStatusWorstCase === 'R' ? 'red' : assembly.qnoteStatusWorstCase === 'Y' ? 'yellow': assembly.qnoteStatusWorstCase === 'G' ? 'green' : 'no-data';
        	}
        };
        
        /**
         * Sums the total number of children (showing) for the given node
         * 
         * @param {Assembly} root base node to start summing from 
         * @returns {Number} total number of children showing
         */
        assembly.totalChildren = function(root){
        	if( !root ) root = assembly;
        	var sum = 0;
        	if( !root.children ) sum += 1;
        	else angular.forEach( root.children, function(child){ assembly.totalChildren(child); } );
       		return sum;
        };
        
        /**
         * Determines if this assembly is being displayed; you're displayed if you're in your parent's children array
         * 
         * @returns {Boolean} true if displayed; false otherwise
         */        
        assembly.isDisplayed = function(){
        	var parent = assembly.parent;
        	if( !parent ) return true;
        	var found = false;
        	angular.forEach( parent.children, function(child){ if( child.id === assembly.id ) found = true;} );
        	return found;
        };
        
        /**
         * Expands this node (non-recursive)
         */
        assembly.expand = function(){
        	if( !assembly.children ){
        		assembly.children = assembly._children;
        		assembly._children = null;
        	}
        };
        
        /**
         * Collapses this node (non-recursive)
         */
        assembly.collapse = function(){
        	if( !assembly._children ){
        		assembly._children = assembly.children;
        		assembly.children = null;
        	}
        };
    };

    /**
     * Helper function to wrap raw assembly data (as retrieved from a file or DB) in an Assembly object
     * This function also recursively wraps any children (objects in the data's children property)
     * 
     * @private
     * @param {Object} baseAssembly Raw data to wrap
     * @returns {Assembly} wrapped assembly object
     */
    function _wrapAssemblies(baseAssembly){
    	var newAssembly = new Assembly(baseAssembly);
    	
    	if(typeof baseAssembly.children != 'undefined'){
    		angular.forEach(baseAssembly.children, function(child, index){
    			baseAssembly.children[index].parentId = baseAssembly.id;
    			newAssembly.children[index] = _wrapAssemblies(baseAssembly.children[index]);
    		});
    	}
    	
    	return newAssembly;
    };
    

    /**
     * Sort the child nodes (recursively) of the root in pyramid style; that is
     * nodes with the most children are in the center of the list; nodes with the least
     * children are on the ends.  The nodes are sorted in-place.
     * 
     * This is used by the layout system to create a more visually appealing and balanced
     * look to the tree when displayed.
     * 
     * @param {Assembly} root Base/root node to start sorting at
     */
    function _pyramidSort( root ){
    	if( !root || !root.children ) return;
    	var mid = Math.floor( root.children.length / 2 );
    	var a2 = root.children.sort( function(a,b){ 
    		var aChildren = a.children? a.children.length : 0;
    		var bChildren = b.children? b.children.length : 0;
    		return aChildren - bChildren;
    	} ).splice(mid);
    	root.children = root.children.concat( a2.reverse());
    	angular.forEach( root.children, function(child){ _pyramidSort(child);});
    };

    /**
     * Fetch an assembly (and child assemblies) from the REST provider that meet critiera
     * 
     * @param {string} partNumber assembly part number criteria to fetch
     * @param {string} partSite assembly part site criteria to fetch
     * @param {string} assemblyNumber assembly assembly number to fetch
     * @param {string} assemblySite assembly assembly site to fetch
     * @param {number} [childLimit] if supplied, will 'collapse' all children if the child count exceeds this number
     * @param {string} type node type (material or supplier)
     * @return {Assembly} root assembly and children (recursive) matching the criteria  
     */
	function query(partNumber, partSite, assemblyNumber, assemblySite, childLimit, type) {
		var params = { partNumber: partNumber, partSite: partSite, assemblyNumber: assemblyNumber, assemblySite: assemblySite };
		return $http.get(URL + "/" + type, { params: params} )
			.then(function(response){
				var bomHierarchy = _wrapAssemblies(response.data);
				_pyramidSort( bomHierarchy );
				if( childLimit ) _collapseIfMoreThan(bomHierarchy.children,childLimit);
				return bomHierarchy;
			});
	};
	
	/**
	 * Collapses child nodes (recursively) if the child count for the node exceeds the childLimit
	 * Collapsing is accomplished by moving any nodes in the 'children' array of the node to the _children 
	 * array for the node; in this way, D3's layout algorithms (which only search for the children property) will
	 * not process the children nodes; later these nodes can be moved over to the children property and layout will
	 * process them; this supports a hide/show feature of the nodes
	 * 
	 * @private
	 * @param {Assembly|Assembly[]} data root node or children nodes to start processing from
	 * @param {number} childLimit limit that when reached/exceeded will result in collapsed nodes
	 */
	function _collapseIfMoreThan( data, childLimit ){
		var nodes = [];
		if( data ){
			if( !angular.isArray( data ) )
				nodes.push(data);
			else
				nodes = data;
			
			nodes.forEach( function(node){
				if( node.children && node.children.length > childLimit ){
					node._children = node.children;
					node.children = null;
				}
				_collapseIfMoreThan( node.children, childLimit );
				_collapseIfMoreThan( node._children, childLimit );
			} );
		}
	};
	
	/**
	 * Checks whether the part number and part site provided are unique
	 * 
	 * @param {string} partNumber
	 * @param {string} partSite
	 * @returns an array of assemblies that have the same part number and part site; empty array if no match
	 */
	function checkUniquePartAndSite(partNumber, partSite){
		var favorite = this;
		var reqURL = URL + "/unique/?partNumber=" + partNumber + "&partSite=" + partSite;
		return $http.post( reqURL, favorite ).then( function(results){
			return results.data;
		});
	};
	
	/**
	 * Finds a list of parts based on the search term and name provided
	 * 
	 * @param {string} term
	 * @param {string} name
	 * @returns an array of assemblies that match the name and the search term on at least one property; empty array if no match
	 */
	function findAssemblies(term, name){
		var reqURL = URL + "/search";
		return $http.post( reqURL, {term: term, name: name}).then( function(results){
			return results.data;
		});
	};

	/** @var service Definition of the exposed service methods */
	var service = {
		
		/** Checks whether the part number and part site provided are unique @function @see checkUniquePartAndSite @public */
		checkUniquePartAndSite : checkUniquePartAndSite,
		
		/** Finds a list of assemblies based on the search term provided @function @see findParts @public */
		findAssemblies : findAssemblies,

		/** Fetch assemblies @function @see query @public */
		query : query
	};

	return service;
};