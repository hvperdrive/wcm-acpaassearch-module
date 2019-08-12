angular
	.module("acpaassearch_1.0.16")
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
