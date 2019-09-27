"use strict";

angular.module("acpaassearch_1.2.1.directives", []);
angular.module("acpaassearch_1.2.1.factories", []);
angular.module("acpaassearch_1.2.1.services", ["acpaassearch_1.2.1.factories"]);
angular.module("acpaassearch_1.2.1.controllers", ["acpaassearch_1.2.1.services"]);

angular
	.module("acpaassearch_1.2.1", [
		"pelorus.services",

		"acpaassearch_1.2.1.directives",
		"acpaassearch_1.2.1.factories",
		"acpaassearch_1.2.1.services",
		"acpaassearch_1.2.1.controllers",
	])
	.run([function() {
		console.log("Members module is available!"); // eslint-disable-line no-console
	}]);
