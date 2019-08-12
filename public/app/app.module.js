angular.module("acpaassearch_1.0.16.directives", []);
angular.module("acpaassearch_1.0.16.factories", []);
angular.module("acpaassearch_1.0.16.services", ["acpaassearch_1.0.16.factories"]);
angular.module("acpaassearch_1.0.16.controllers", ["acpaassearch_1.0.16.services"]);

angular
	.module("acpaassearch_1.0.16", [
		"pelorus.services",

		"acpaassearch_1.0.16.directives",
		"acpaassearch_1.0.16.factories",
		"acpaassearch_1.0.16.services",
		"acpaassearch_1.0.16.controllers",
	])
	.run([function() {
		console.log("Members module is available!"); // eslint-disable-line no-console
	}]);
