const productSearchHelper = require("./product");
const mappers = require("./mappers");

module.exports.getQuery = (query, limit, type) => ({
	from: 0,
	size: 10000,
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
				size: 10000,
			},
			aggs: {
				hits: {
					"top_hits": {
						size: limit || 10000,
					},
				},
			},
		},
	}
});

module.exports.getSuggestQuery = (query, limit, type) => ({
	from: 0,
	size: limit || 10000,
	query: {
		"dis_max": {
			queries: [].concat(
				productSearchHelper.getQuery(query, type)
			),
		},
	},
});

module.exports.getCategoryQuery = (query, category, skip, limit, type) => ({
	from: skip,
	size: limit || 10000,
	query: {
		"dis_max": {
			queries: [].concat(
				productSearchHelper.getQuery(query, type)
			),
		},
	},
	filter: {
		term: {
			"fields.productCategory": category,
		},
	},
});

module.exports.resultMapper = (result) => mappers.mapResults(result);

module.exports.suggestMapper = (result) => mappers.mapSuggestionResults(result);
