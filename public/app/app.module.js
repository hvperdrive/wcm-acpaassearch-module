"use strict";

angular.module("acpaassearch_0.0.37.directives", []);
angular.module("acpaassearch_0.0.37.factories", []);
angular.module("acpaassearch_0.0.37.services", ["acpaassearch_0.0.37.factories"]);
angular.module("acpaassearch_0.0.37.controllers", ["acpaassearch_0.0.37.services"]);

angular
	.module("acpaassearch_0.0.37", [
		"pelorus.services",

		"acpaassearch_0.0.37.directives",
		"acpaassearch_0.0.37.factories",
		"acpaassearch_0.0.37.services",
		"acpaassearch_0.0.37.controllers",
	])
	.run([function() {
		console.log("Members module is available!"); // eslint-disable-line no-console
	}]);
