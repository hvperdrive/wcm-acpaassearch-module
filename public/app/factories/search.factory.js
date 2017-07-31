"use strict";

angular
	.module("acpaassearch_0.0.21.factories")
	.factory("acpaassearchFactory", [
		"$http",
		"configuration",

		function(
			$http,
			configuration
		) {
			var api = configuration.serverPath + configuration.apiPrefix + configuration.apiLevel;
			var factory = {};

			factory.reindexSearch = function() {
				return $http.get(api + "acpaassearch/reindex");
			};

			return factory;
		},
	]);
