"use strict";

var customItems = require("./customItems");

module.exports = {
	properties: {
		fields: {
			type: "nested",
			properties: {
				title: {
					type: "string",
				},
				intro: {
					type: "string",
				},
				about: {
					type: "string",
				},
				roadmap: {
					type: "nested",
					properties: {
						fields: {
							type: "object",
							properties: {
								title: {
									type: "string",
								},
								notes: {
									type: "string",
								},
								version: {
									type: "string",
								},
							},
						},
						uuid: {
							index: "no",
							type: "string",
						},
					},
				},
				customItems: customItems,
			},
		},
		meta: {
			type: "object",
			properties: {
				activeLanguages: {
					index: "no",
					type: "string",
				},
				contentType: {
					index: "no",
					type: "string",
				},
				created: {
					index: "no",
					type: "date",
					format: "strict_date_optional_time||epoch_millis"
				},
				lastModified: {
					index: "no",
					type: "date",
					format: "strict_date_optional_time||epoch_millis"
				},
				publishDate: {
					index: "no",
					type: "date",
					format: "strict_date_optional_time||epoch_millis"
				},
				slug: {
					index: "no",
					type: "string",
				},
				taxonomy: {
					type: "object",
					properties: {
						tags: {
							type: "nested",
							properties: {
								id: {
									index: "no",
									type: "string",
								},
								label: {
									index: "no",
									type: "string",
								},
							},
						},
					},
				},
			},
		},
		uuid: {
			index: "no",
			type: "string",
		},
	},
};
