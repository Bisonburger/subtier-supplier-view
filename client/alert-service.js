/**
 * Alert Service
 * 
 * This service allows UI Bootstrap dismissable alerts of any variety be 
 * created from throughout the application.  Controllers that need to 
 * create alerts, should inject the 'alertService' and call it as below
 * with the two required parameters of 'type' and 'message'.  An optional
 * auto-dismissable timeout is allowed (default of 3 seconds).  Another optional
 * parameter of a function to be called on dismissal is also allowed.
 * 
 * Example usage:
 * 			alertService.add('success', 'Footer is ready!');
			alertService.add('warning', 'Footer is NOT ready!', 5000);
			alertService.add('warning', 'Footer is NOT ready!', 5000, closeFunction);
 * 
 * @author Nicholas Barrett
 */
define([], function() {
	return [ '$rootScope', function($rootScope) {
		
		var alerts = new Array();
		
		function add(type, msg, timeout, closeFunction) {
			if(!timeout) {
				timeout = 5000;
			}
			if(!closeFunction) {
				closeFunction = function() {
					return closeAlert(this);
				};
			}
			
			return alerts.push({
				type : type,
				msg : msg,
				timeout: timeout,
				close : closeFunction
			});
		}

		function closeAlert(alert) {
			return closeAlertIdx(alerts.indexOf(alert));
		}

		function closeAlertIdx(index) {
			return alerts.splice(index, 1);
		}

		function clear() {
			alerts = [];
		}

		function get() {
			return alerts;
		}

		var service = {
			add : add,
			closeAlert : closeAlert,
			closeAlertIdx : closeAlertIdx,
			clear : clear,
			get : get
		};

		return service;
	}];
});