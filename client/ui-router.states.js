define([],
    function() {
        return {
            otherwise: 'notfound',
            when: '/favorite-list',
            states: {
                'app': {
                    url: '/',
                    views: {
                        'header':{templateUrl: 'header.html'},
                        'content': '',
                        'footer':{templateUrl: 'footer.html'},
                    }
                },

                'app.favorite-list': {
                    url: 'favorite-list',
                    views: {
                        'content@': { template: '<favorite-list></favorite-list>'}
                    }
                },
                'app.favorite-details': {
                    url: 'favorite/:id',
                    views: {
                        'content@': { template: '<favorite-details></favorite-details>'}
                    }
                },
                'app.visualization': {
                    url: 'visualization?partNumber&partSite&assemblyNumber&assemblySite',
                    views: {
                        'content@': {template: '<ssv-view></ssv-view>'}
                    }
                },
                'app.notfound': {
                    url: 'notfound',
                    views: {
                        'content@': {templateUrl: 'not-found.html'}
                    }
                }
            }
        };
    });
