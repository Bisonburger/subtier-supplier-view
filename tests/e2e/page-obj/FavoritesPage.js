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

var EC = protractor.ExpectedConditions;
var Page = require( './Page' );

/**
 * FavoritesPage PageObjects
 * @class
 */
class FavoritesPage extends Page{
    
    /**
     * Add a favorite action
     * 
     * @returns {FavoritesDetailPage} detail page
     */
    addFavorite(){ 
        this.btnAddFavorite.click(); 
        return new (require( './FavoritesDetailPage' ))();
    }
    
    /**
     * Edit a favorite action 
     * 
     * @param {Element} favorite DOM Element for the favorite to edit
     * @returns {FavoritesDetailPage} detail page
     */
    editFavorite(favorite){
        favorite.element( by.className( 'fa-pencil') ).click();
        return new (require( './FavoritesDetailPage' ))();
    }
    
    /**
     * View BOM for a favorite 
     * 
     * @param {Element} favorite DOM Element for the favorite to view
     * @returns {BomViewPage} bom page
     */
    viewBOM(favorite){
        favorite.element( by.className( 'fa-sitemap') ).click();
        return new (require( './BomViewPage' ))();
    }
    
    /**
     * Delete a favorite action 
     * 
     * @param {Element} favorite DOM Element for the favorite to delete
     * @param {boolean} [cancel=false] flag to cancel the delete operation
     */
    deleteFavorite(favorite,cancel){
        favorite.element( by.className( 'fa-trash') ).click();
        element(by.partialButtonText( (cancel)?'Cancel':'Delete')).click();
    }
    
    /** page URL to be appended to baseUrl @getter */
    get pageUrl(){ return '/#/favorite-list'; }
    
    /** Add Favorites button @getter */    
    get btnAddFavorite(){ return element( by.partialButtonText( 'Add Favorite' ) ); }
    
    /** Array of favorite elements @getter */
    get favorites(){ return element.all(by.repeater('favorite in $ctrl.favorites')); }
}

module.exports = FavoritesPage;