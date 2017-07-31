"use strict";

angular.module("acpaassearch_0.0.21.directives", []);
angular.module("acpaassearch_0.0.21.factories", []);
angular.module("acpaassearch_0.0.21.services", ["acpaassearch_0.0.21.factories"]);
angular.module("acpaassearch_0.0.21.controllers", ["acpaassearch_0.0.21.services"]);

angular
	.module("acpaassearch_0.0.21", [
		"pelorus.services",

		"acpaassearch_0.0.21.directives",
		"acpaassearch_0.0.21.factories",
		"acpaassearch_0.0.21.services",
		"acpaassearch_0.0.21.controllers",
	])
	.run([function() {
		console.log("Members module is available!"); // eslint-disable-line no-console
	}]);
