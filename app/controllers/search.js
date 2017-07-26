var elasticClient = require("../helpers/elastic");
var SearchHelper = require("../helpers/search");
var variablesHelper = require("../helpers/variables");

module.exports.search = function search(req, res) {
	var variables = variablesHelper();
	var q = req.query.q || req.query.query;

	if (!q) {
		return res.status(400).json({
			err: "No query parameter 'q' found in the request.",
		});
	}

	elasticClient.client.search({
		index: variables.acpaassearch.variables.index,
		type: ["product"],
		body: SearchHelper.getQuery(q, null),
	})
		.then(
			function onSuccess(result) {
				res.status(200).json(result);
			},
			function onError(responseError) {
				res.status(500).json({
					err: responseError,
				});
			}
		);
};
