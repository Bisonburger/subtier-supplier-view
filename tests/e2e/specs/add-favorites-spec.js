/* global expect jasmine */

var EC = protractor.ExpectedConditions;

var FavoritesDetailPage = require( '../page-obj/FavoritesDetailPage' );


describe('add favorites for the ssv', () => {
    
    var detailsPage = null;
    
    beforeAll( () => jasmine.addMatchers( require('../custom-matchers.js') ) );
    
    beforeEach( () => {
        browser.addMockModule('ssv.mock.assemblysvc', require('../mocks/assembly-service-mock' ) );
        //detailsPage = new FavoritesDetailPage().load();
    });
    
    afterEach( () => browser.clearMockModules() );

    xit('should show the add favorites page by default', () => {
        expect( browser.getCurrentUrl() ).toContain( 'favorite' );
        expect(EC.urlIs('favorite'));
        // Note that 'null' values for a input are really zero-length strings...
        expect(detailsPage.inputFavoriteName.getAttribute('value') ).toEqual('');
        expect(detailsPage.inputSupplier.getAttribute('value') ).toEqual('');
        expect(detailsPage.inputPart.getAttribute('value')).toEqual('');
    });
    
    xit( 'should show an error if the name is blank after editing' );
    
    xit( 'should show a dropdown for suppliers matching' );
    
    xit( 'should indicate no suppliers matching' );
    
    xit( 'should show a parts list for the selected supplier matching typing');
    
    xit( 'should indicate no parts match' );
    
    xit( 'should not allow bad supplier');
    
    xit( 'should not allow bad parts' );
    
    xit( 'should save the favorite' );
    
    xit( 'should cancel saving the favorite' );
    
    xit( 'should clear the parts field on supplier change' );
    

});
