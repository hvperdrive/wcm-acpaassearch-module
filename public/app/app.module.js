"use strict";

angular.module("acpaassearch_0.0.38.directives", []);
angular.module("acpaassearch_0.0.38.factories", []);
angular.module("acpaassearch_0.0.38.services", ["acpaassearch_0.0.38.factories"]);
angular.module("acpaassearch_0.0.38.controllers", ["acpaassearch_0.0.38.services"]);

angular
	.module("acpaassearch_0.0.38", [
		"pelorus.services",

		"acpaassearch_0.0.38.directives",
		"acpaassearch_0.0.38.factories",
		"acpaassearch_0.0.38.services",
		"acpaassearch_0.0.38.controllers",
	])
	.run([function() {
		console.log("Members module is available!"); // eslint-disable-line no-console
	}]);
