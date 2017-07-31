"use strict";

angular
	.module("acpaassearch_0.0.22")
	.provider("acpaassearchConfig", [
		function membersConfig() {
			this.API = {
				name: "acpaassearch",
				version: "0.0.22",
				basePath: "app/modules/",
			};

			this.API.modulePath = this.API.basePath + this.API.name + "_" + this.API.version + "/";

			this.$get = function get() {
				return this.API;
			};
		},
	]);
