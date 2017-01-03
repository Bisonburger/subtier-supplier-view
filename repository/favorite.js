module.exports = {		
	query: query
};

var alasql = require('alasql');

function query(){
	return alasql.promise( 'select * from xlsx("data/data.xlsx",{sheetid:"favorites"})' )
	.then(function(data){return data;})
	.catch(function(err){ console.log('Error:', err); return []; });
}

