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

function getRoadmapItemsQuery(query, type) {
	return {
		"nested": {
			"path": "fields.roadmap",
			"query": {
				"multi_match": {
					"query": query,
					"fields": ["fields.roadmap.fields.*"],
					"type": "phrase_prefix",
					"slop": 50,
				},
			},
		},
	};
}

function getCustomItemsQuery(query, type) {
	return {
		"nested": {
			"path": "fields.customItems",
			"query": {
				"multi_match": {
					"query": query,
					"fields": ["fields.customItems.fields.*"],
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
		getRoadmapItemsQuery(query, type),
		getCustomItemsQuery(query, type),
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
