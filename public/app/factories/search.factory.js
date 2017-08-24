"use strict";

angular
	.module("acpaassearch_0.0.40.factories")
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
				return $http.put(api + "acpaassearch/reindex");
			};

			return factory;
		},
	]);
