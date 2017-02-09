define(['ssv', 'angular-mocks'], function() {
    return FavoriteSvcMock;
});


var FavoriteSvcMock = {
    Basic: jasmine.createSpyObj('FavoriteSvcMock.Basic', ['create', 'query', 'fetch', 'wrap'])
};
