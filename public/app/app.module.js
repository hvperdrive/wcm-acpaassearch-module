"use strict";

angular.module("acpaassearch_0.0.39.directives", []);
angular.module("acpaassearch_0.0.39.factories", []);
angular.module("acpaassearch_0.0.39.services", ["acpaassearch_0.0.39.factories"]);
angular.module("acpaassearch_0.0.39.controllers", ["acpaassearch_0.0.39.services"]);

angular
	.module("acpaassearch_0.0.39", [
		"pelorus.services",

		"acpaassearch_0.0.39.directives",
		"acpaassearch_0.0.39.factories",
		"acpaassearch_0.0.39.services",
		"acpaassearch_0.0.39.controllers",
	])
	.run([function() {
		console.log("Members module is available!"); // eslint-disable-line no-console
	}]);
