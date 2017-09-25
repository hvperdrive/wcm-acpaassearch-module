"use strict";

angular.module("acpaassearch_0.0.42.directives", []);
angular.module("acpaassearch_0.0.42.factories", []);
angular.module("acpaassearch_0.0.42.services", ["acpaassearch_0.0.42.factories"]);
angular.module("acpaassearch_0.0.42.controllers", ["acpaassearch_0.0.42.services"]);

angular
	.module("acpaassearch_0.0.42", [
		"pelorus.services",

		"acpaassearch_0.0.42.directives",
		"acpaassearch_0.0.42.factories",
		"acpaassearch_0.0.42.services",
		"acpaassearch_0.0.42.controllers",
	])
	.run([function() {
		console.log("Members module is available!"); // eslint-disable-line no-console
	}]);
