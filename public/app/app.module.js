"use strict";

angular.module("acpaassearch_0.0.25.directives", []);
angular.module("acpaassearch_0.0.25.factories", []);
angular.module("acpaassearch_0.0.25.services", ["acpaassearch_0.0.25.factories"]);
angular.module("acpaassearch_0.0.25.controllers", ["acpaassearch_0.0.25.services"]);

angular
	.module("acpaassearch_0.0.25", [
		"pelorus.services",

		"acpaassearch_0.0.25.directives",
		"acpaassearch_0.0.25.factories",
		"acpaassearch_0.0.25.services",
		"acpaassearch_0.0.25.controllers",
	])
	.run([function() {
		console.log("Members module is available!"); // eslint-disable-line no-console
	}]);
