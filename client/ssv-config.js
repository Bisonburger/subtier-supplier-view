define([], function() {
	var config = {
			
			/*
			attributes:
			{
				"partNumber": {
					shown: true,
					display: 'partNumber',
					group: 'Part data'
				}
			},
			*/
			attributeList : [ "partNumber", "partDescription", "partSupplierName",
				"cspl", 'mcil', 'mdaSrm', 'carl', 'criticalDefenseInfo',
				'logicBearing', 'foreign', 'country', 'dmeaTrustedSource',
				'gidepSubscriber' ],
			
			/* mapping of attribute to display name - if not named, the attribute is used as the display
			 * will be camelCaseToHuman converted
			 */
			attributeMap: {
				partDescription: 'Part Description',
				partSupplierName: 'Supplier Name',
				cspl: 'CSPL',
				mcil: 'MCIL',
				mdaSrm: 'MDA SRM',
				carl: 'CARL',
				gidepSubscriber: 'GIDEP Subscriber',
				dmeaTrustedSource: 'DMEA Trusted Source'
				},
			attributesShown:
				{
				"partNumber" : true,
				"partSite" : true,
				"partDescription" : true,
				"partSupplierName" : false,
				"cspl" : false,
				"mcil" : false,
				"mdaSrm" : false,
				"carl" : false,
				"criticalDefenseInfo" : false,
				"logicBearing" : false,
				"foreign" : false,
				"country" : false,
				"dmeaTrustedSource" : false,
				"gidepSubscriber" : false
				}
	};
	return config;
});