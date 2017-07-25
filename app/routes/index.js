var cron = require("../controllers/cron");
var listeners = require("../controllers/listeners");

module.exports = function(app, hooks) {
	// Initiate elastic
	require("../helpers/elastic");

	// Setup listeners
	listeners.start();

	// Setup hooks
	require("../controllers/hooks")(hooks);

	// start cronjobs
	cron.start();
};
