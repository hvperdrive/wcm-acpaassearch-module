"use strict";

angular
	.module("acpaassearch_1.3.4")
	.config([
		"$stateProvider",
		"acpaassearchConfigProvider",

		function(
			$stateProvider,
			acpaassearchConfigProvider
		) {

			var moduleFolder = acpaassearchConfigProvider.API.modulePath;

			$stateProvider
			.state("pelorus.acpaassearch.index", {
				url: "",
				access: {
					requiresLogin: true,
				},
				ncyBreadcrumb: {
					label: "{{breadcrumb}}",
				},
				templateUrl: moduleFolder + "views/overview.html",
				controller: "acpaassearchOverviewController",
			});
		},
	]
);
