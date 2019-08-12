const _ = require("lodash");
const elasticClient = require("../helpers/elastic");
const SearchHelper = require("../helpers/search");
const variablesHelper = require("../helpers/variables");

const execSearch = function execSearch(body, type) {
	const variables = variablesHelper();

	return elasticClient.client.search({
		index: variables.acpaassearch.variables.index,
		type: type,
		body: body,
	});
};

const getQuery = function getQuery(req) {
	return req.query.q || req.query.query;
};

const getLimit = function getLimit(req) {
	// Total request cannot be bigger then 10000 (Elastic weardness).
	let limit = req.query.limit ? parseInt(req.query.limit) : 10000;
	let skip = req.query.skip ? parseInt(req.query.skip) : 0;

	if (isNaN(skip)) {
		skip = 0;
	}

	if (isNaN(limit)) {
		limit = 10000;
	}

	if ((skip + limit) > 10000) {
		limit -= skip + limit - 10000;
	}

	return limit;
};

const getSkip = function getSkip(req) {
	return req.query.skip || 0;
};

const getUserType = function getUserType(req) {
	return _.get(req, "member.meta.type", null);
};

module.exports.search = function search(req, res) {
	const q = getQuery(req);

	if (!q) {
		return res.status(400).json({
			err: "No query parameter 'q' found in the request.",
		});
	}
	execSearch(SearchHelper.getQuery(q, getLimit(req), getUserType(req)), ["product"])
		.then(
			function onSuccess(result) {
				res.status(200).json(SearchHelper.resultMapper(result));
			},
			function onError(responseError) {
				res.status(500).json({
					err: responseError,
				});
			}
		);
};

module.exports.suggest = function suggest(req, res) {
	const q = getQuery(req);

	if (!q) {
		return res.status(400).json({
			err: "No query parameter 'q' found in the request.",
		});
	}

	execSearch(SearchHelper.getSuggestQuery(q, getLimit(req), getUserType(req)), ["product"])
		.then(
			function onSuccess(result) {
				res.status(200).json(SearchHelper.suggestMapper(result));
			},
			function onError(responseError) {
				res.status(500).json({
					err: responseError,
				});
			}
		);
};

module.exports.category = function category(req, res) {
	const q = getQuery(req);
	const cat = req.params.uuid;

	if (!q) {
		return res.status(400).json({
			err: "No query parameter 'q' found in the request.",
		});
	}

	if (!cat) {
		return res.status(400).json({
			err: "No parameter 'category' found in the request.",
		});
	}

	execSearch(SearchHelper.getCategoryQuery(q, cat, getSkip(req), getLimit(req), getUserType(req)), ["product"])
		.then(
			function onSuccess(result) {
				res.status(200).json(SearchHelper.suggestMapper(result));
			},
			function onError(responseError) {
				res.status(500).json({
					err: responseError,
				});
			}
		);
};
