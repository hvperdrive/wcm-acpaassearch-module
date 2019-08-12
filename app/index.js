const cron = require("./controllers/cron");
const contentTypes = require("./helpers/contentTypes");
const searchRoutes = require("./routes/search");
const variablesHelper = require("./helpers/variables");

module.exports = function(app, hooks, info) {
	variablesHelper.reload(info)
		.finally(function() {
			// Initiate elastic
			require("./helpers/elastic").reload();

			// Setup hooks
			require("./controllers/hooks")(hooks);

			// start cronjobs
			cron.start();

			// Update contentTypes
			contentTypes.reload();
		});



	// Setup routes
	searchRoutes(app);
};
