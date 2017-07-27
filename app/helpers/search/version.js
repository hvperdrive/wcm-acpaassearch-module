function getProductFieldsQuery(query, type) {
	return {
		"query": {
			"multi_match": {
				"query": query,
				"fields": ["fields.*"],
				"type": "phrase_prefix",
				"slop": 50,
			},
		},
	};
}

function getAPIFieldsQuery(query, type) {
	return {
		"nested": {
			"path": "fields.apiS",
			"query": {
				"multi_match": {
					"query": query,
					"fields": ["fields.apiS.fields.*"],
					"type": "phrase_prefix",
					"slop": 50,
				},
			},
		},
	};
}


module.exports.getQuery = function getProductsQuery(query, type) {
	return [
		getProductFieldsQuery(query, type),
		getAPIFieldsQuery(query, type),
	];
};

module.exports.getHighlightFields = function getHighlightFields() {
	return {
		"fields.*": {
			"term_vector": "with_positions_offsets",
			"fragment_size": 200,
		},
	};
};
