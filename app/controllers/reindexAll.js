const syncAll = require("../helpers/syncAll");
const indicesHelper = require("../helpers/indices");
const mappings = require("../config/mappings");

module.exports.reindexAll = (req, res) => {
	const elasticsearch = require("../helpers/elastic");

	indicesHelper
		.remove(elasticsearch.client, elasticsearch.index)
		.then(indicesHelper.createOrUpdate.bind(null, elasticsearch.client, {
			index: elasticsearch.index,
			mappings: mappings,
		}))
		.then(syncAll);

	res.status(200).json({
		msg: "Reindex started...",
	});
};
