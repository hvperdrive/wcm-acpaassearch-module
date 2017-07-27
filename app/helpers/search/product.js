var _ = require("lodash");

function getProductFieldsQuery(query, type) {
	return _.map(["title", "intro", "about"], function (fieldName) {
		return {
			"nested": {
				"path": "fields." + fieldName,
				"query": {
					"match_phrase_prefix": {
						["fields." + fieldName + ".value"]: {
							"query": query,
							"slop": 50
						}
					}
				},
				"inner_hits": {
					"name": fieldName
				}
			}
		};
	});
}

function getRoadmapItemsQuery(query, type) {
	return [{
		"nested": {
			"path": "fields.roadmap",
			"query": {
				"multi_match": {
					"query": query,
					"fields": ["fields.roadmap.*"],
					"type": "phrase_prefix",
					"slop": 50,
				},
			},
			"inner_hits": {
				"name": "roadmap"
			}
		},
	}];
}

function getCustomItemsQuery(query, type) {
	return [{
		"nested": {
			"path": "fields.customItems",
			"query": {
				"multi_match": {
					"query": query,
					"fields": ["fields.customItems.*"],
					"type": "phrase_prefix",
					"slop": 50,
				},
			},
			"inner_hits": {
				"name": "customItems"
			}
		}
	}];
}

function getVersionItemsQuery(query, type) {
	return [{
		"nested": {
			"path": "fields.versionItems",
			"query": {
				"multi_match": {
					"query": query,
					"fields": ["fields.versionItems.*"],
					"type": "phrase_prefix",
					"slop": 50,
				},
			},
			"inner_hits": {
				"name": "versionItems"
			}
		}
	}];
}

function getApiItemsQuery(query, type) {
	return [{
		"nested": {
			"path": "fields.apiS",
			"query": {
				"multi_match": {
					"query": query,
					"fields": ["fields.apiS.*"],
					"type": "phrase_prefix",
					"slop": 50,
				},
			},
			"inner_hits": {
				"name": "apiS"
			}
		}
	}];
}

module.exports.getQuery = function getProductsQuery(query, type) {
	return [].concat(
		getProductFieldsQuery(query, type),
		getRoadmapItemsQuery(query, type),
		getCustomItemsQuery(query, type),
		getVersionItemsQuery(query, type),
		getApiItemsQuery(query, type)
	);
};

module.exports.getHighlightFields = function getHighlightFields() {
	return {
		"fields.*": {
			"term_vector": "with_positions_offsets",
			"fragment_size": 200,
		},
	};
};
