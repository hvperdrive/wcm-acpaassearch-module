"use strict";

var customItems = require("./customItems");

module.exports = {
	properties: {
		fields: {
			type: "nested",
			properties: {
				versionLabel: {
					type: "string",
				},
				architecture: {
					type: "string",
				},
				faq: {
					type: "string",
				},
				features: {
					type: "string",
				},
				gettingStarted: {
					type: "string",
				},
				releaseNotes: {
					type: "string",
				},
				apiS: {
					type: "nested",
					properties: {
						title: {
							type: "string",
						},
						about: {
							type: "string",
						},
						customItems: customItems,
						uuid: {
							index: "no",
							type: "string",
						},
					},
				},
			},
		},
		meta: {
			type: "object",
			properties: {
				contentType: {
					type: "string",
				},
			},
		},
		uuid: {
			index: "no",
			type: "string",
		},
	},
};
