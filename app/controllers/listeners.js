var Emitter = require("app/middleware/emitter");

var contentTypes = require("../helpers/contentTypes");
var productHelper = require("../helpers/product");
var versionHelper = require("../helpers/version");

var actions = {
	product: {
		fetch: productHelper.fetchProduct,
		sync: productHelper.syncProduct,
		remove: productHelper.removeProduct,
	},
	// version: {
	// 	fetch: versionHelper.fetchVersion,
	// 	sync: versionHelper.syncVersion,
	// 	remove: versionHelper.removeVersion,
	// },
};

function verifyAction(action, contentType) {
	return actions.hasOwnProperty(contentType.type) ? actions[contentType.type][action] : function () {};
}

function handleUpdate(contentItem, action) {
	var contentType = contentTypes.verifyType(contentItem.meta.contentType);

	if (!contentType) {
		return console.log("CONTENTTYPE NOT ALLOWED", contentType);
	}

	var syncAction = verifyAction(action, contentType);
	var fetchAction = verifyAction("fetch", contentType);

	if (!syncAction) {
		return console.log("ACTION NOT ALLOWED", action);
	}

	var elasticsearch = require("../helpers/elastic");

	if (fetchAction) {
		return fetchAction(contentItem.uuid)
			.then(function(populatedContent) {
				syncAction(populatedContent, elasticsearch.client);
			}, function(err) {
				throw err;
			});
	}

	syncAction(contentItem, elasticsearch.client);
}

module.exports.start = function start() {
	Emitter.on("contentCreated", function(contentItem) {
		handleUpdate(contentItem, "sync");
	});

	Emitter.on("contentUpdated", function(contentItem) {
		handleUpdate(contentItem, "sync");
	});

	Emitter.on("contentRemoved", function(contentItem) {
		handleUpdate(contentItem, "remove");
	});
};
