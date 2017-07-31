"use strict";

angular.module("acpaassearch_0.0.22.directives", []);
angular.module("acpaassearch_0.0.22.factories", []);
angular.module("acpaassearch_0.0.22.services", ["acpaassearch_0.0.22.factories"]);
angular.module("acpaassearch_0.0.22.controllers", ["acpaassearch_0.0.22.services"]);

angular
	.module("acpaassearch_0.0.22", [
		"pelorus.services",

		"acpaassearch_0.0.22.directives",
		"acpaassearch_0.0.22.factories",
		"acpaassearch_0.0.22.services",
		"acpaassearch_0.0.22.controllers",
	])
	.run([function() {
		console.log("Members module is available!"); // eslint-disable-line no-console
	}]);
