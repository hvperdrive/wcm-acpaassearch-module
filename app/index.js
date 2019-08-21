const cron = require("./controllers/cron");
const contentTypes = require("./helpers/contentTypes");
const searchRoutes = require("./routes/search");
const variablesHelper = require("./helpers/variables");
const listeners = require("./controllers/listeners");

module.exports = (app, hooks, info) => {
	variablesHelper.reload(info).finally(() => {
		// Initiate elastic
		require("./helpers/elastic").reload();

		// Setup hooks
		require("./controllers/hooks")(hooks);

		// start cronjobs
		cron.start();

		// Update contentTypes
		contentTypes.reload();

		// Start listeners
		listeners.start();
	});

	// Setup routes
	searchRoutes(app);
};
