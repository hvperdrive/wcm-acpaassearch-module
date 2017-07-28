var cron = require("../controllers/cron");
var listeners = require("../controllers/listeners");
var contentTypes = require("../helpers/contentTypes");

module.exports = function(app, hooks) {
	// Initiate elastic
	require("../helpers/elastic");

	// Setup listeners
	listeners.start();

	// Setup hooks
	require("../controllers/hooks")(hooks);

	// Update contentTypes
	contentTypes.reload();

	// start cronjobs
	cron.start();
};
