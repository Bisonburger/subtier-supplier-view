define( [], function(){ return BomTreeNodeDirective; } );

function BomTreeNodeDirective(){
	var directive = {
			scope: {
                node: '<',
                attributes: '<',
                scale: '<?',
                expandFn: '&'
            },
            controllerAs: '$ctrl',
            bindToController: true,
            controller: function BomTreeNodeController(){
            	var ctrl = this;
            	ctrl.clicked = function(){
            	};
            },
            restrict: 'E',
            templateUrl: 'pages/ssv/components/bomTree/bom-tree-node-tmpl.html',
            replace: true,
            templateNamespace: 'svg'
	};
	
	return directive;
}