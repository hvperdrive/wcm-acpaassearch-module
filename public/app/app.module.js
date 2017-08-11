"use strict";

angular.module("acpaassearch_0.0.36.directives", []);
angular.module("acpaassearch_0.0.36.factories", []);
angular.module("acpaassearch_0.0.36.services", ["acpaassearch_0.0.36.factories"]);
angular.module("acpaassearch_0.0.36.controllers", ["acpaassearch_0.0.36.services"]);

angular
	.module("acpaassearch_0.0.36", [
		"pelorus.services",

		"acpaassearch_0.0.36.directives",
		"acpaassearch_0.0.36.factories",
		"acpaassearch_0.0.36.services",
		"acpaassearch_0.0.36.controllers",
	])
	.run([function() {
		console.log("Members module is available!"); // eslint-disable-line no-console
	}]);
