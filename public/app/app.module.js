"use strict";

angular.module("acpaassearch_1.3.0.directives", []);
angular.module("acpaassearch_1.3.0.factories", []);
angular.module("acpaassearch_1.3.0.services", ["acpaassearch_1.3.0.factories"]);
angular.module("acpaassearch_1.3.0.controllers", ["acpaassearch_1.3.0.services"]);

angular
	.module("acpaassearch_1.3.0", [
		"pelorus.services",

		"acpaassearch_1.3.0.directives",
		"acpaassearch_1.3.0.factories",
		"acpaassearch_1.3.0.services",
		"acpaassearch_1.3.0.controllers",
	])
	.run([function() {
		console.log("Members module is available!"); // eslint-disable-line no-console
	}]);
