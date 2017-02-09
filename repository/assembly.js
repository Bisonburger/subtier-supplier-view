module.exports = {		
	queryMaterial: queryMaterial
};

var alasql = require('alasql');

function queryMaterial(partNumber,partSite,assemblyNumber,assemblySite){
	return alasql.promise('select * from xlsx("data/data.xlsx",{sheetid:"assemblies"})')
	.then(function(data){
		
		data.forEach( function(row){
			if( row.parent ){
				 var parent = data.find( (r) => r.id === row.parent );
				 if( parent ){
					 if( !parent.children ) parent.children = [];
					 parent.children.push( row );
				 }	
				 else
					 console.log( 'Unable to find node with id' + row.parent );
			}
		});
	    return data.find( (r) => (partNumber && partSite && assemblyNumber && assemblySite)? (r.partNumber === partNumber && r.partSite === partSite && r.assemblyNumber === assemblyNumber && r.assemblySite === assemblySite): !r.parent );
	    
	}).catch(function(err){
	     console.log('Error:', err);
	     return [];
	});
}

