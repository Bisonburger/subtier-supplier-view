define(['ssv', 'angular-mocks'], function() {
    return AssemblySvcMock;
});


var AssemblySvcMock = {
    Basic: jasmine.createSpyObj('AssemblySvcMock.Basic', ['checkUniquePartAndSite', 'findAssemblies', 'query'])
};
