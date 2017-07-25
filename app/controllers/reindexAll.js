"use strict";

var syncAll = require("../helpers/syncAll");

module.exports = function(req, res) {
	var syncNonModified = req.query.all === "true";

	syncAll(syncNonModified);

	res.status(200).json({
		msg: "Reindex started...",
	});
};
