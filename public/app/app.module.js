"use strict";

angular.module("acpaassearch_1.3.4.directives", []);
angular.module("acpaassearch_1.3.4.factories", []);
angular.module("acpaassearch_1.3.4.services", ["acpaassearch_1.3.4.factories"]);
angular.module("acpaassearch_1.3.4.controllers", ["acpaassearch_1.3.4.services"]);

angular
	.module("acpaassearch_1.3.4", [
		"pelorus.services",

		"acpaassearch_1.3.4.directives",
		"acpaassearch_1.3.4.factories",
		"acpaassearch_1.3.4.services",
		"acpaassearch_1.3.4.controllers",
	])
	.run([function() {
		console.log("Members module is available!"); // eslint-disable-line no-console
	}]);
