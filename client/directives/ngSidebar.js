var angular = require('angular');

angular.module('ngSidebar', [ 'ui.bootstrap', 'ngAnimate' ]).directive(
		'ngSidebar', [ '$rootScope', ngSidebar ]);

function ngSidebar($rootScope) {
	var directive = {
		restrict : 'E',
		scope : true,
		link : link
	};
	var sidebar;
	var sidebarContainer;
	var header;

	
	function link(scope, element, attrs) {
		sidebar = element[0];
		sidebarContainer = document.querySelector('.js-side-nav-container');
		header = angular.element(document.querySelector('.side-nav__hide'));

		header.on('click', hideSideNav);

		scope.$on('openSidebar', showSideNav);
		scope.$on('hideSidebar', hideSideNav);

		element.on('transitionend', function() {
			sidebarContainer.classList.remove('side-nav--animatable');
			sidebar.removeEventListener('transitionend', onTransitionEnd);
		});

	}

	function showSideNav() {
		sidebar.classList.add('side-nav--animatable');
		sidebar.classList.add('side-nav--visible');
		sidebar.addEventListener('transitionend', onTransitionEnd);
		$rootScope.$broadcast('sideNavShow');
	}

	function hideSideNav() {
		sidebar.classList.add('side-nav--animatable');
		sidebar.classList.remove('side-nav--visible');
		sidebar.removeEventListener('transitionend', onTransitionEnd);
		$rootScope.$broadcast('sideNavHide');
	}

	function onTransitionEnd() {
		sidebar.classList.remove('side-nav--animatable');
		sidebar.removeEventListener('transitionend', onTransitionEnd);
	}

	return directive;
}
