"use strict";

angular
	.module("acpaassearch_1.0.16")
	.provider("acpaassearchConfig", [
		"MODULE_ENV_CONFIG",

		function membersConfig(MODULE_ENV_CONFIG) {
			this.API = {
				name: MODULE_ENV_CONFIG.angularModule,
				version: "1.0.16",
				feDirPath: MODULE_ENV_CONFIG.feDirPath,
				assetsDirPath: MODULE_ENV_CONFIG.assetsDirPath,
				cssDirPath: MODULE_ENV_CONFIG.cssDirPath,
			};

			this.API.modulePath = this.API.feDirPath;

			this.$get = function get() {
				return this.API;
			};
		},
	]);