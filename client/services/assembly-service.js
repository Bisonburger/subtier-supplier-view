define([], function() {
	return [ '$http', '$q', '$log', 'ENDPOINTS', AssemblyService ];
});

function AssemblyService($http, $q, $log, ENDPOINTS) {
	var URL = ENDPOINTS["ssv"] + "/assembly";
	var angular = require('angular');
	
    function Assembly(opts){
        var assembly = this;
        
        angular.extend( assembly, opts );   
        
        assembly.getColor = function(colorIndicatorType){
        	if(colorIndicatorType == 'schedule'){
        		return assembly.scheduleStatus === 'R' ? 'red' : assembly.scheduleStatus === 'Y' ? 'yellow': assembly.scheduleStatus === 'G' ? 'green' : 'no-data';        		
        	} else if (colorIndicatorType == 'spc'){
        		return assembly.spcStatus === 'R' ? 'red' : assembly.spcStatus === 'Y' ? 'yellow': assembly.spcStatus === 'G' ? 'green' : 'no-data';
        	} else {
        		return assembly.qnoteStatus === 'R' ? 'red' : assembly.qnoteStatus === 'Y' ? 'yellow': assembly.qnoteStatus === 'G' ? 'green' : 'no-data';
        	}
        };
        
        assembly.getWorstCaseColor = function(colorIndicatorType){
        	if(colorIndicatorType == 'schedule'){
        		return assembly.scheduleStatusWorstCase === 'R' ? 'red' : assembly.scheduleStatusWorstCase === 'Y' ? 'yellow': assembly.scheduleStatusWorstCase === 'G' ? 'green' : 'no-data';        		
        	} else if (colorIndicatorType == 'spc'){
        		return assembly.spcStatusWorstCase === 'R' ? 'red' : assembly.spcStatusWorstCase === 'Y' ? 'yellow': assembly.spcStatusWorstCase === 'G' ? 'green' : 'no-data';
        	} else {
        		return assembly.qnoteStatusWorstCase === 'R' ? 'red' : assembly.qnoteStatusWorstCase === 'Y' ? 'yellow': assembly.qnoteStatusWorstCase === 'G' ? 'green' : 'no-data';
        	}
        };
        
        assembly.totalChildren = function(root){
        	if( !root ) root = assembly;
        	var sum = 0;
        	if( !root.children ) sum += 1;
        	else angular.forEach( root.children, function(child){ assembly.totalChildren(child); } );
       		return sum;
        };
    }

    function _wrapAssemblies(baseAssembly){
    	var newAssembly = new Assembly(baseAssembly);
    	
    	if(typeof baseAssembly.children != 'undefined'){
    		angular.forEach(baseAssembly.children, function(child, index){
    			baseAssembly.children[index].parentId = baseAssembly.id;
    			newAssembly.children[index] = _wrapAssemblies(baseAssembly.children[index]);
    		});
    	}
    	
    	return newAssembly;
    }
    
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
    }

	function query(partNumber, partSite, assemblyNumber, assemblySite, childLimit, type) {
		var params = { partNumber: partNumber, partSite: partSite, assemblyNumber: assemblyNumber, assemblySite: assemblySite };
		return $http.get(URL + "/" + type, { params: params} )
			.then(function(response){
				var bomHierarchy = _wrapAssemblies(response.data);
				_pyramidSort( bomHierarchy );
				if( childLimit ) _collapseIfMoreThan(bomHierarchy.children,childLimit);
				return bomHierarchy;
			});
	}
	
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
	}
	
	/**
	 * Checks whether the part number and part site provided are unique
	 * 
	 * @returns a list of assemblies that have the same part number and part site
	 */
	function checkUniquePartAndSite(partNumber, partSite){
		var reqURL = URL + "/unique/?partNumber=" + partNumber + "&partSite=" + partSite;
		return $http.post( reqURL, this ).then( function(results){
			return results.data;
		});
	}

	var service = {
		checkUniquePartAndSite : checkUniquePartAndSite,
		query : query
	};

	return service;
}