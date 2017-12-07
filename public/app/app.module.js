"use strict";

angular.module("acpaassearch_1.0.3.directives", []);
angular.module("acpaassearch_1.0.3.factories", []);
angular.module("acpaassearch_1.0.3.services", ["acpaassearch_1.0.3.factories"]);
angular.module("acpaassearch_1.0.3.controllers", ["acpaassearch_1.0.3.services"]);

angular
	.module("acpaassearch_1.0.3", [
		"pelorus.services",

		"acpaassearch_1.0.3.directives",
		"acpaassearch_1.0.3.factories",
		"acpaassearch_1.0.3.services",
		"acpaassearch_1.0.3.controllers",
	])
	.run([function() {
		console.log("Members module is available!"); // eslint-disable-line no-console
	}]);
