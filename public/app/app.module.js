"use strict";

angular.module("acpaassearch_1.1.5.directives", []);
angular.module("acpaassearch_1.1.5.factories", []);
angular.module("acpaassearch_1.1.5.services", ["acpaassearch_1.1.5.factories"]);
angular.module("acpaassearch_1.1.5.controllers", ["acpaassearch_1.1.5.services"]);

angular
	.module("acpaassearch_1.1.5", [
		"pelorus.services",

		"acpaassearch_1.1.5.directives",
		"acpaassearch_1.1.5.factories",
		"acpaassearch_1.1.5.services",
		"acpaassearch_1.1.5.controllers",
	])
	.run([function() {
		console.log("Members module is available!"); // eslint-disable-line no-console
	}]);
