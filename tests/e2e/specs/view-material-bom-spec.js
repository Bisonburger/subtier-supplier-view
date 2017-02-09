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
var BomViewPage = require( '../page-obj/BomViewPage' );

describe('material ssv bom', () => {

    beforeAll( () => jasmine.addMatchers( require('../custom-matchers.js') ) );
    beforeEach( () => browser.addMockModule('ssv.mock.assemblysvc', require('../mocks/assembly-service-mock' ) ) );
    afterEach( () => browser.clearMockModules() );

    xit( 'should show the bom tree', () => {
        /*
         * GIVEN:   when I go to the baseURL for a valid part
         * THEN:    I should see the bom tree view for that part
         */
    });
    
    xit( 'should expand/collapse a node', () => { 
        /*
         * GIVEN:   when I go to the baseURL for a valid part
         * WHEN:    I click on a nodes expand/collapse icon that is colapsed
         * THEN:    I should see see the node expanded
         * WHEN:    I click on a nodes expand/collapse icon that is expaned
         * THEN:    I should see see the node collapsed
         */
    });
    
    xit( 'should pan the view', () => { 
        /*
         * GIVEN:   when I go to the baseURL for a valid part
         * WHEN:    I drag the mouse left in the bom tree
         * THEN:    The bom tree should pan left
         * WHEN:    I drag the mouse right in the bom tree
         * THEN:    The bom tree should pan right
         * WHEN:    I drag the mouse up in the bom tree
         * THEN:    The bom tree should pan up
         * WHEN:    I drag the mouse down in the bom tree
         * THEN:    The bom tree should pan down
         */
    });
    
    xit( 'should zoom the view', () => {
        /*
         * GIVEN:   when I go to the baseURL for a valid part
         * WHEN:    I scroll the mouse wheel up
         * THEN:    The bom tree should zoom out to a limit
         * WHEN:    I scroll the mouse wheel down
         * THEN:    The bom tree should zoom in to a limit
         */
    } );
    
    xit( 'should select a node on the tree', () => { 
        /*
         * GIVEN:   when I go to the baseURL for a valid part
         * WHEN:    I click on a tree node
         * THEN:    The node's details should be shown in the details pane
         * AND:     The breadcrumbs bar should reflect that node's path to root
         */
    });
    
    xit( 'should select a node via breadcrumbs',  () => {
        /*
         * GIVEN:   when I go to the baseURL for a valid part
         * WHEN:    I click on a link in the breadcrumbs
         * THEN:    The node's details should be shown in the details pane
         * AND:     The breadcrumbs bar should reflect that node's path to root
         * AND:     That node should be centered in the bom view
         */

    });
    
    xit( 'should save the current selection as a favorite', () => {
        /*
         * GIVEN:   when I go to the baseURL for a valid part
         * WHEN:    I click on the Save as a Favorite Button
         * THEN:    The should be saved as a favorite
         */
    } );
    
    xit( 'should return to favorites with no specs', () => {
        /*
         * GIVEN:   when I go to the baseURL with no part information
         * THEN:    The should be redirected to the favorites list page
         * AND:     I should recieve an alert
         */
    });            
        
    xit( 'should return to favorites with bad part number', () => {
        /*
         * GIVEN:   when I go to the baseURL with invalid part information (e.g. a bad part number)
         * THEN:    The should be redirected to the favorites list page
         * AND:     I should recieve an alert
         */
    });            
});
