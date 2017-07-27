var _ = require("lodash");
var productSearchHelper = require("./product");
var mappers = require("./mappers");

module.exports.getQuery = function getQuery(query, type) {
	return {
		from: 0,
		size: 10000,
		highlight: {
			order: "score",
			fields: Object.assign({}, productSearchHelper.getHighlightFields()),
		},
		query: {
			"dis_max": {
				queries: [].concat(
					productSearchHelper.getQuery(query, type)
				),
			},
		},
		aggs: {
			byCategory: {
				terms: {
					field: "fields.productCategory",
				},
				aggs: {
					hits: {
						"top_hits": {
							size: 10000,
						},
					},
				},
			},
		},
	};
};

module.exports.resultMapper = function resultMapper(result) {
	return mappers.mapResults(result);
};
