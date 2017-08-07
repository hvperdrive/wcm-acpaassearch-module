"use strict";

angular.module("acpaassearch_0.0.33.directives", []);
angular.module("acpaassearch_0.0.33.factories", []);
angular.module("acpaassearch_0.0.33.services", ["acpaassearch_0.0.33.factories"]);
angular.module("acpaassearch_0.0.33.controllers", ["acpaassearch_0.0.33.services"]);

angular
	.module("acpaassearch_0.0.33", [
		"pelorus.services",

		"acpaassearch_0.0.33.directives",
		"acpaassearch_0.0.33.factories",
		"acpaassearch_0.0.33.services",
		"acpaassearch_0.0.33.controllers",
	])
	.run([function() {
		console.log("Members module is available!"); // eslint-disable-line no-console
	}]);
