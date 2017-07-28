var Q = require("q");

var Emitter = require("app/middleware/emitter");

var contentTypes = require("../helpers/contentTypes");
var productHelper = require("../helpers/product");

var actions = {
	product: {
		fetch: productHelper.fetchProduct,
		sync: productHelper.syncProduct,
		remove: productHelper.removeProduct,
	}
};

function verifyAction(action, contentType) {
	if (actions.hasOwnProperty(contentType.type) && actions[contentType.type].hasOwnProperty(action)) {
		return actions[contentType.type][action];
	}

	if (actions.hasOwnProperty(action)) {
		return actions[action];
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
				console.log("SYNCING PRODUCTS", products);
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

module.exports.start = function start() {
	Emitter.on("contentCreated", function(contentItem) {
		try {
			handleUpdate(contentItem, "sync");
		} catch (err) {
			console.log(err);
		}
	});

	Emitter.on("contentUpdated", function(contentItem) {
		try {
			handleUpdate(contentItem, "sync");
		} catch (err) {
			console.log(err);
		}
	});

	Emitter.on("contentRemoved", function(contentItem) {
		try {
			handleUpdate(contentItem, "remove");
		} catch (err) {
			console.log(err);
		}
	});
};
