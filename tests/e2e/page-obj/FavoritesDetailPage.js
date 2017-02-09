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
 
var FavoritesPage = require( './FavoritesPage' );

var Page = require( './Page' );

class FavoritesDetailPage extends Page{

    get pageUrl(){ return '/#/favorite/'; }
    get inputFavoriteName(){ return element( by.model('$ctrl.favorite.description') );}
    get inputSupplier(){ return element( by.model('$ctrl.selectedSupplier') );}
    get inputPart(){ return element( by.model('selectedPart') );}
    get btnSave(){ return element( by.partialButtonText('Save') ); }
    get btnCancel(){ return  element( by.partialButtonText('Cancel') ); }
    get btnBackToFavorites(){  element( by.partialButtonText('Back To Favorites') ); }

    save(){
       btnSave.click();
        return new FavoritesPage();            
    }
    
    cancel(){
        btnCancel.click();
        return new FavoritesPage();        
    }
    
    backToFavorites(){
        btnBackToFavorites.click();
        return new FavoritesPage();    
    }
}

module.exports = FavoritesDetailPage;
