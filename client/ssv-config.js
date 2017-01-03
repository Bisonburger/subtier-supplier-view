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
 * Define configuration constants for the fields/attributes to display
 * 
 * For each member of the config hash the key is the Assembly attribute
 * The value is an object containing
 * 		displayName: String value to use for display; if not present will use the key (converted from camel case to human readable)
 * 		materialView: boolean value to indicate if it is used in the material view
 * 		materialViewChecked: boolean value to indicate if the value is checked/selected if used in the material view
 * 		supplierView: boolean value to indicate if it is used in the supplier view
 * 		supplierViewChecked: boolean value to indicate if the value is checked/selected if used in the supplier view
 * 		disabled: boolean value to indicate if the value should be disabled in the config
 * 		noFilter: boolean value to indicate if the value should be filterable
 * 
 * 	If the Assembly object has an attribute that is not listed here; it will not be displayed (only values listed are used)
 */
define([], function() {
	var config = {			
		'partNumber': {
			displayName: 'Part Number',
			materialView: true,
			materialViewChecked: true,
			disabled: false,
			noFilter: true
		},
		'partDescription': {
			displayName: 'Part Description',
			disabled: true
		},
		'partSite':{
			displayName: 'CAGE Code',
			materialView: true,
			materialViewChecked: true,
			disabled: false
		},
		'partMakeBuyTransfer':{
			displayName: 'Transfer Code',
			materialView: true			
		},
		'partSupplier': {
			displayName: 'Supplier',
			materialView: true,
			materialViewChecked: false
		},
		'cspl': {
			displayName: 'CSPL',
			materialView: true,
			materialViewChecked: false
		},
		'mcil': {
			displayName: 'MCIL',
			materialView: true,
			materialViewChecked: false
		},
		'mdaSrm': {
			displayName: 'MDA SRM',
			materialView: true,
			materialViewChecked: false
		},
		'carl': {
			displayName: 'CARL',
			materialView: true,
			materialViewChecked: false
		},
		'criticalDefenseInfo': {
			displayName: 'Critical Defense Info',
			materialView: true,
			materialViewChecked: false
		},
		'logicBearing': {
			displayName: 'Logic Bearing',
			materialView: true,
			materialViewChecked: false
		},
		'foreign': {
			displayName: 'Foreign',
			supplierView: true,
			supplierViewChecked: true,
			materialView: true,
			materialViewChecked: false
		},
		'country': {
			displayName: 'Country',
			supplierView: true,
			supplierViewChecked: true,
			materialView: true,
			materialViewChecked: false
		},
		'dmeaTrustedSource': {
			displayName: 'DMEA Trusted Source',
			supplierView: true,
			supplierViewChecked: true,
			materialView: true,
			materialViewChecked: false
		},
		'gidepSubscriber': {
			displayName: 'GIDEP Subscriber',
			supplierView: true,
			supplierViewChecked: true,
			materialView: true,
			materialViewChecked: false
		}
	};
	
	return config;
});