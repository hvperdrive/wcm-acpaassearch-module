"use strict";

angular.module("acpaassearch_0.0.31.directives", []);
angular.module("acpaassearch_0.0.31.factories", []);
angular.module("acpaassearch_0.0.31.services", ["acpaassearch_0.0.31.factories"]);
angular.module("acpaassearch_0.0.31.controllers", ["acpaassearch_0.0.31.services"]);

angular
	.module("acpaassearch_0.0.31", [
		"pelorus.services",

		"acpaassearch_0.0.31.directives",
		"acpaassearch_0.0.31.factories",
		"acpaassearch_0.0.31.services",
		"acpaassearch_0.0.31.controllers",
	])
	.run([function() {
		console.log("Members module is available!"); // eslint-disable-line no-console
	}]);
