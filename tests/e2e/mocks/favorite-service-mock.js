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

/**
 * Mock service for FavoriteSvc - will be executed in the browser - so
 * avoid using anything 'strange' and make this 'self contained'
 * 
 * (i.e. dont use ES6 or anything that isnt part of IE! )
 */
function favoriteServiceMock(){
    angular.module("ssv.mock.favoritesvc", [])
        .service('FavoriteSvc', ['$q', function($q) {
            var favorites = [
                {   id: 'MOCK-1',
                    partNumber: 'PART-1',
                    partSite: 'PARTSITE-1',
                    assemblyNumber: 'ASSEMBLY-1',
                    assemblySite: 'ASSEMBLYSITE-1',
                    description: 'MOCK-1-DESCRIPTION'
                },
                {   id: 'MOCK-2',
                    partNumber: 'PART-2',
                    partSite: 'PARTSITE-2',
                    assemblyNumber: 'ASSEMBLY-2',
                    assemblySite: 'ASSEMBLYSITE-2',
                    description: 'MOCK-2-DESCRIPTION'
                }];

            return {
                query: function() {
                    return $q.resolve(favorites);
                },
                fetch: function(id) {
                    return $q.resolve(favorites[0]);
                }
            };
        }]);
}

module.exports = favoriteServiceMock;
