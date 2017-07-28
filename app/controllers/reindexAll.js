"use strict";

var syncAll = require("../helpers/syncAll");

module.exports = function(req, res) {
	syncAll();

	res.status(200).json({
		msg: "Reindex started...",
	});
};
