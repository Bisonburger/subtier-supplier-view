define(['ssv', 'angular-mocks'], function() {
    return SupplierSvcMock;
});

var SupplierSvcMock = {
    Basic: jasmine.createSpyObj('SupplierSvcMock.Basic', ['findSuppliers'])
};