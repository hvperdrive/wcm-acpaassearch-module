"use strict";

angular.module("acpaassearch_0.0.40.directives", []);
angular.module("acpaassearch_0.0.40.factories", []);
angular.module("acpaassearch_0.0.40.services", ["acpaassearch_0.0.40.factories"]);
angular.module("acpaassearch_0.0.40.controllers", ["acpaassearch_0.0.40.services"]);

angular
	.module("acpaassearch_0.0.40", [
		"pelorus.services",

		"acpaassearch_0.0.40.directives",
		"acpaassearch_0.0.40.factories",
		"acpaassearch_0.0.40.services",
		"acpaassearch_0.0.40.controllers",
	])
	.run([function() {
		console.log("Members module is available!"); // eslint-disable-line no-console
	}]);
