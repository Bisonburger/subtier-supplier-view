define( [ 'angular',
          '../services/ssv-services',
          './assemblyParentage/assembly-parentage-component',
          './assemblyView/assembly-view-component',
          './bomTree/bom-tree-component',
          './ssvView/ssv-view-component',
          './bomTable/bom-table-component',
          './favorite/favorite-list-component',
          './favorite/favorite-details-component',
          './bomFilter/bom-filter-component',
          './bomTree/bom-tree-config-component',
          './bomTree/bom-tree-node-directive',
          './bomTree/bom-tree-swimlane-directive'
          ],

function( angular, ssvServices, assemblyParentageComponent, assemblyViewComponent, bomTreeComponent, ssvViewComponent, bomTableComponent, 
		  favoriteListComponent, favoriteDetailsComponent, bomFilterComponent, bomTreeConfigComponent, bomTreeNodeDirective, bomTreeSwimlaneDirective ){

	var ssvComponents = angular.module( 'ssv.components', ['ssv.services', 'ui.router','ui.bootstrap','ngAnimate', 'ngSidebar', 'ngColorPicker'] )
			   .component( 'assemblyParentage', assemblyParentageComponent )
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