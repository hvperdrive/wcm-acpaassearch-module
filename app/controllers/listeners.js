var Emitter = require("app/middleware/emitter");

var contentTypes = require("../helpers/contentTypes");
var productHelper = require("../helpers/product");
var docHelper = require("../helpers/doc");

var actions = {
	product: {
		fetch: productHelper.fetchProduct,
		sync: productHelper.syncProduct,
		remove: productHelper.removeProduct,
	},
	main_documentation: { // eslint-disable-line camelcase
		fetch: docHelper.fetchDoc,
		sync: productHelper.syncProduct,
		remove: productHelper.removeProduct,
	},
};

function verifyAction(action, contentType) {
	if (actions.hasOwnProperty(contentType.type) && actions[contentType.type].hasOwnProperty(action)) {
		return actions[contentType.type][action];
	}

	return null;
}

function handleUpdate(contentItem, action) {
	var contentType = contentTypes.verifyType(contentItem.meta.contentType);

	if (!contentType) {
		return console.log("CONTENTTYPE NOT ALLOWED", contentType);
	}

	var elasticsearch = require("../helpers/elastic");
	var syncAction = verifyAction(action, contentType);
	var fetchAction = verifyAction("fetch", contentType);

	if (!syncAction) {
		return productHelper.fetchProductsForDoc(contentItem, elasticsearch)
			.then(function(products) {
				return productHelper.syncProducts(products, elasticsearch);
			});
	}

	if (fetchAction) {
		return fetchAction(contentItem)
			.then(function(populatedContent) {
				syncAction(populatedContent, elasticsearch);
			}, function(err) {
				throw err;
			});
	}

	syncAction(contentItem, elasticsearch);
}

function onContentCreated(contentItem) {
	try {
		handleUpdate(contentItem, "sync");
	} catch (err) {
		console.log(err);
	}
}

function onContentUpdated(contentItem) {
	try {
		handleUpdate(contentItem, "sync");
	} catch (err) {
		console.log(err);
	}
}

function onContentRemoved(contentItem) {
	try {
		handleUpdate(contentItem, "remove");
	} catch (err) {
		console.log(err);
	}
}

module.exports.start = function start() {
	Emitter.on("contentCreated", onContentCreated);

	Emitter.on("contentUpdated", onContentUpdated);

	Emitter.on("contentRemoved", onContentRemoved);
};

module.exports.stop = function stop() {
	Emitter.removeListener("contentCreated", onContentCreated);

	Emitter.removeListener("contentUpdated", onContentUpdated);

	Emitter.removeListener("contentRemoved", onContentRemoved);
};
