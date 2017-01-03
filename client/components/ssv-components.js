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

define( [ 'angular',
          'ngSidebar',
          'ngColorPicker',
          '../services/ssv-services',
          './assemblyParentage/assembly-parentage-component',
          './assemblyLegend/assembly-legend-component',
          './assemblyView/assembly-view-component',
          './bomTree/bom-tree-component',
          './ssvView/ssv-view-component',
          './bomTable/bom-table-component',
          './favorite/favoriteList/favorite-list-component',
          './favorite/favoriteDetails/favorite-details-component',
          './bomFilter/bom-filter-component',
          './bomTree/bomTreeConfig/bom-tree-config-component',
          './bomTree/bomTreeNode/bom-tree-node-directive',
          './bomTree/bomTreeSwimlane/bom-tree-swimlane-directive'
          ],

/**
 * Define and register an angular module for all the components
 * 
 * @module ssv.components
 * @name ssv.components
 * 
 */
function( angular, ngSidebar, ngColorPicker, ssvServices, 
		  assemblyParentageComponent, assemblyLegendComponent, assemblyViewComponent, bomTreeComponent, ssvViewComponent, bomTableComponent, 
		  favoriteListComponent, favoriteDetailsComponent, bomFilterComponent, bomTreeConfigComponent, bomTreeNodeDirective, bomTreeSwimlaneDirective ){

	var ssvComponents = angular.module( 'ssv.components', ['ssv.services', 'ui.router','ui.bootstrap','ngAnimate', 'ngSidebar', 'ngColorPicker'] )
			   .component( 'assemblyParentage', assemblyParentageComponent )
			   .component( 'assemblyLegend', assemblyLegendComponent )
			   .component( 'assemblyView', assemblyViewComponent )
			   .component( 'bomTree', bomTreeComponent )
			   .component( 'ssvView', ssvViewComponent )
			   .component( 'bomTable', bomTableComponent )
			   .component( 'favoriteList', favoriteListComponent)
			   .component( 'favoriteDetails', favoriteDetailsComponent)
			   .component( 'bomFilter', bomFilterComponent)
			   .component( 'bomTreeConfig', bomTreeConfigComponent)
			   .directive( 'bomTreeNode', bomTreeNodeDirective )
	   		   .directive( 'bomTreeSwimlane', bomTreeSwimlaneDirective );
	
	return ssvComponents;
});