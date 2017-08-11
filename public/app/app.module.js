"use strict";

angular.module("acpaassearch_0.0.32.directives", []);
angular.module("acpaassearch_0.0.32.factories", []);
angular.module("acpaassearch_0.0.32.services", ["acpaassearch_0.0.32.factories"]);
angular.module("acpaassearch_0.0.32.controllers", ["acpaassearch_0.0.32.services"]);

angular
	.module("acpaassearch_0.0.32", [
		"pelorus.services",

		"acpaassearch_0.0.32.directives",
		"acpaassearch_0.0.32.factories",
		"acpaassearch_0.0.32.services",
		"acpaassearch_0.0.32.controllers",
	])
	.run([function() {
		console.log("Members module is available!"); // eslint-disable-line no-console
	}]);
