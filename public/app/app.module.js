"use strict";

angular.module("acpaassearch_0.0.27.directives", []);
angular.module("acpaassearch_0.0.27.factories", []);
angular.module("acpaassearch_0.0.27.services", ["acpaassearch_0.0.27.factories"]);
angular.module("acpaassearch_0.0.27.controllers", ["acpaassearch_0.0.27.services"]);

angular
	.module("acpaassearch_0.0.27", [
		"pelorus.services",

		"acpaassearch_0.0.27.directives",
		"acpaassearch_0.0.27.factories",
		"acpaassearch_0.0.27.services",
		"acpaassearch_0.0.27.controllers",
	])
	.run([function() {
		console.log("Members module is available!"); // eslint-disable-line no-console
	}]);
