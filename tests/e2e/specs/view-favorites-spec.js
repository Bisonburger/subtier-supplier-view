/*
 * RAYTHEON PROPRIETARY
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
 
/* global expect jasmine */

var EC = protractor.ExpectedConditions;
var FavoritesPage = require( '../page-obj/FavoritesPage' );

/*
 * FEATURE:  list ssv favorites - A user wants to view and/or interact with their favorite parts list
 */
describe('list ssv favorites', () => {
    var page = null;

    beforeAll( () => jasmine.addMatchers( require('../custom-matchers.js') ) );
    
    beforeEach( () => {
        browser.addMockModule('ssv.mock.favoritesvc', require('../mocks/favorite-service-mock' ) );
        browser.addMockModule('ssv.mock.assemblysvc', require('../mocks/assembly-service-mock' ) );
        page = new FavoritesPage().load();
    });
    
    afterEach( () => browser.clearMockModules() );

    it('should show the favorites page by default', () => {
        /*
         * GIVEN:   when I go to the baseURL
         * THEN:    I should see the favorites page
         */
        expect( page ).toBeDefined( 'Page isnt loaded' );
        expect( browser.getCurrentUrl() ).toContain('favorite-list');
    });

    it('should go to add a favorites page when "Add favorites" is clicked', () => {
        /*
         * GIVEN:   when I go to the baseURL
         * WHEN:    I click the add favorites button
         * THEN:    I should see the favorite detail page
         * AND:     the details should be blank
         */
        expect( page ).toBeDefined( 'Page isnt loaded' );
        let detailsPage = page.addFavorite();
        expect( browser.getCurrentUrl() ).toContain('favorite/');
        // Note that 'null' values for a input are really zero-length strings...
        expect(detailsPage.inputFavoriteName.getAttribute('value') ).toEqual('');
        expect(detailsPage.inputSupplier.getAttribute('value') ).toEqual('');
        expect(detailsPage.inputPart.getAttribute('value')).toEqual('');
    });

    xit('should go to the BOM view page for a favorite', () => {
        /*
         * GIVEN:   when I go to the baseURL
         * WHEN:    I click the View icon for the first favorite
         * THEN:    I should see the bom view page
         * AND:     the details should be for the first favorite
         */
        expect( page ).toBeDefined( 'Page isnt loaded' );
        let bomPage = page.viewBOM( page.favorites.first() );
        expect(browser.getCurrentUrl()).toContain('PART-1');
        // TODO: make sure it went to the 'right' bom view page
    });

    xit('should go to the edit page for a favorite', () => {
        /*
         * GIVEN:   when I go to the baseURL
         * WHEN:    I click the Edit icon for the first favorite
         * THEN:    I should see the favorite detail page
         * AND:     the details should be for the first favorite
         */
        expect( page ).toBeDefined( 'Page isnt loaded' );
        let detailsPage = page.editFavorite( page.favorites.first() );
        expect(EC.urlIs('favorite'));
        expect(detailsPage.inputFavoriteName.getAttribute('value') ).toEqual('MOCK-1-DESCRIPTION');
    });

    xit('should delete a favorite', () => {
        /*
         * GIVEN:   when I go to the baseURL
         * WHEN:    I click the Delete icon for the first favorite
         * THEN:    I should be prompted to confirm
         * WHEN:    I click the delete button
         * THEN:    The first favorite should be removed from the list
         */
        expect( page ).toBeDefined( 'Page isnt loaded' );
        let originalCount = page.favorites.count();
        page.deleteFavorite( page.favorites.first(), false );
        expect(page.favorites.count()).toEqual((originalCount - 1), 'Favorites should have deleted an item'); 
        //TODO: make sure we deleted the right one
    }).pend('Bad test - need to rewrite');
    
    xit('should cancel deleting a favorite', () => {
        /*
         * GIVEN:   when I go to the baseURL
         * WHEN:    I click the Delete icon for the first favorite
         * THEN:    I should be prompted to confirm
         * WHEN:    I click the cancel button
         * THEN:    I should return to the favorites list with all previous favorites listed
         */
        expect( page ).toBeDefined( 'Page isnt loaded' );
        let originalCount = page.favorites.count();
        page.deleteFavorite( page.favorites.first(), true );
        expect(page.favorites.count()).toEqual(originalCount, 'Favorites should not be deleted upon cancel'); 
    });

});



