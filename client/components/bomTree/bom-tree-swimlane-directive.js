define( [], function(){ return BomTreeSwimlaneDirective; } );

function BomTreeSwimlaneDirective(){

	var directive = {
			scope: {
                swimlane: '<',
                level: '<'
            },
            controllerAs: '$ctrl',
            bindToController: true,
            controller: function BomTreeSwimlaneController(){
            	var ctrl = this;
            },
            restrict: 'E',
            templateUrl: 'pages/ssv/components/bomTree/bom-tree-swimlane-tmpl.html',
            replace: true,
            templateNamespace: 'svg'
	};
	
	return directive;
	
}