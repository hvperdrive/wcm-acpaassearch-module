"use strict";

angular.module("acpaassearch_0.0.23.directives", []);
angular.module("acpaassearch_0.0.23.factories", []);
angular.module("acpaassearch_0.0.23.services", ["acpaassearch_0.0.23.factories"]);
angular.module("acpaassearch_0.0.23.controllers", ["acpaassearch_0.0.23.services"]);

angular
	.module("acpaassearch_0.0.23", [
		"pelorus.services",

		"acpaassearch_0.0.23.directives",
		"acpaassearch_0.0.23.factories",
		"acpaassearch_0.0.23.services",
		"acpaassearch_0.0.23.controllers",
	])
	.run([function() {
		console.log("Members module is available!"); // eslint-disable-line no-console
	}]);
