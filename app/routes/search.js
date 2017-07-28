require("rootpath")();

var searchController = require("../controllers/search");

// Get the configuration of the WCM
var config = require("config")();

var baseUrl = "/" + config.api.prefix + config.api.version + "acpaassearch";

module.exports = function(app) {
	app.route(baseUrl + "/search").get(searchController.search);
	app.route(baseUrl + "/suggest").get(searchController.suggest);
};
