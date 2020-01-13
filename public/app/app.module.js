"use strict";

angular.module("acpaassearch_1.3.2.directives", []);
angular.module("acpaassearch_1.3.2.factories", []);
angular.module("acpaassearch_1.3.2.services", ["acpaassearch_1.3.2.factories"]);
angular.module("acpaassearch_1.3.2.controllers", ["acpaassearch_1.3.2.services"]);

angular
	.module("acpaassearch_1.3.2", [
		"pelorus.services",

		"acpaassearch_1.3.2.directives",
		"acpaassearch_1.3.2.factories",
		"acpaassearch_1.3.2.services",
		"acpaassearch_1.3.2.controllers",
	])
	.run([function() {
		console.log("Members module is available!"); // eslint-disable-line no-console
	}]);
