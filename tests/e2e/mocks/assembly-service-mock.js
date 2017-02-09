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

var assemblies = {
    assemblySite: 'ASSEMBLYSITE-1',
    assemblySupplierDescription: 'ASSEMBLYSUPPLIERDESCRIPTION-1',
    assemblyNumber: 'ASSEMBLYNUMBER-1',
    assemblyDescription: 'ASSEMBLYDESCRIPTION-1',
    assemblyMakeBuyTransfer: 'Make',
    partNumber: 'PART-1',
    partDescription: 'DESCRIPTION-PART-1',
    partQuantityPer: 1,
    partSite: 'PARTSITE-1',
    partSupplier: 'SUPPLIER-1',
    partMakeBuyTransfer: 'Make',
    scheduleDaysLate: 0,
    scheduleQuantityLate: 0,
    cspl: 'N',
    mdaSrm: 'N',
    carl: 'N',
    logicBearing: 'N',
    id: 'PART-1-ID',
    parent: null,
    scheduleStatus: 'G',
    spcStatus: 'G',
    spcReason: null,
    qnoteStatus: 'G',
    qnoteReason: null,
    children: []
};

/**
 * Mock service for AssemblySvc - will be executed in the browser - so
 * avoid using anything 'strange' and make this 'self contained'
 * 
 * (i.e. dont use ES6 or anything that isnt part of IE! )
 */
function assemblySvcMock() {
    angular.module("ssv.mock.assemblysvc", [])
        .service('AssemblySvc', ['$q', function($q) {
            var assemblies = {
                assemblySite: 'ASSEMBLYSITE-1',
                assemblySupplierDescription: 'ASSEMBLYSUPPLIERDESCRIPTION-1',
                assemblyNumber: 'ASSEMBLYNUMBER-1',
                assemblyDescription: 'ASSEMBLYDESCRIPTION-1',
                assemblyMakeBuyTransfer: 'Make',
                partNumber: 'PART-1',
                partDescription: 'DESCRIPTION-PART-1',
                partQuantityPer: 1,
                partSite: 'PARTSITE-1',
                partSupplier: 'SUPPLIER-1',
                partMakeBuyTransfer: 'Make',
                scheduleDaysLate: 0,
                scheduleQuantityLate: 0,
                cspl: 'N',
                mdaSrm: 'N',
                carl: 'N',
                logicBearing: 'N',
                id: 'PART-1-ID',
                parent: null,
                scheduleStatus: 'G',
                spcStatus: 'G',
                spcReason: null,
                qnoteStatus: 'G',
                qnoteReason: null,
                children: []
            };

            var service = {
                query: query,
                checkUniquePartAndSite: checkUniquePartAndSite,
                findAssemblies: findAssemblies
            };


            function query(partNumber, partSite, assemblyNumber, assemblySite, childLimit, type) {
                return $q.resolve(assemblies);
            }

            function findAssemblies(term, name) {
                return $q.resolve(assemblies);
            }

            function checkUniquePartAndSite(partNumber, partSite) {
                return $q.resolve(assemblies);
            }

            return service;

        }]);
}

module.exports = assemblySvcMock;
