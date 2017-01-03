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
define( [], function(){ return BomTreeNodeDirective; } );

/**
 * Definition of the BomTreeNode directive
 * This directive is used to simplify the rendering of bom tree nodes in the tree
 * 
 * @name bomTreeNode
 * @module ssv.components
 * 
 */
function BomTreeNodeDirective(){
	var directive = {
			scope: {
                node: '<',
                attributes: '<',
                scale: '<?',
                expandFn: '&',
                isMaterialView: '<'
            },
            controllerAs: '$ctrl',
            bindToController: true,
            controller: [ 'SSVConfig', function ( ssvConfig ){
            	var ctrl = this;
                ctrl.mappedFn = function(input){
                	return (ssvConfig[input] && ssvConfig[input].displayName)? ssvConfig[input].displayName : input;
                };	
            }],
            restrict: 'E',
            templateUrl: 'pages/ssv/components/bomTree/bomTreeNode/bom-tree-node-tmpl.html',
            replace: true,
            templateNamespace: 'svg'
	};
	
	return directive;
}