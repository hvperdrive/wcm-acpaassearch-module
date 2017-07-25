"use strict";

module.exports = {
	type: "nested",
	properties: {
		fields: {
			type: "nested",
			properties: {
				body: {
					type: "string",
				},
				label: {
					type: "string",
				},
			},
		},
		uuid: {
			index: "no",
			type: "string",
		},
		slug: {
			index: "no",
			type: "string",
		},
	},
};
