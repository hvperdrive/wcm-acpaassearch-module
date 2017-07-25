var Emitter = require("app/middleware/emitter");

var contentTypes = require("../helpers.contentTypes").list;
var productHelper = require("../helpers/product");
var versionHelper = require("../helpers/version");

var actions = {
	product: {
		create: productHelper.syncProduct,
		update: productHelper.updateProduct,
		remove: productHelper.removeProduct,
	},
	version: {
		create: versionHelper.syncVersion,
		update: versionHelper.updateVersion,
		remove: versionHelper.removeVersion,
	},
};

function verifyContentType(type) {
	type = typeof type === "string" ? type : type._id;

	return contentTypes.find(function(t) {
		return t.id === type;
	});
}

function verifyAction(action, contentType) {
	return actions.hasOwnProperty(contentType.type) ? actions[contentType.type][action] : function() {};
}

function handleUpdate(contentItem, action) {
	var contentType = verifyContentType(contentItem.meta.contentType);

	if (!contentType) {
		return;
	}

	return verifyAction(contentType, action)(contentItem);
}

module.exports.start = function start() {
	Emitter.on("contentCreated", function(contentItem) {
		handleUpdate(contentItem, "create");
	});

	Emitter.on("contentUpdated", function(contentItem) {
		handleUpdate(contentItem, "update");
	});

	Emitter.on("contentRemoved", function(contentItem) {
		handleUpdate(contentItem, "remove");
	});
};
