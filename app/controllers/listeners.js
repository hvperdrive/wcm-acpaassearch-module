const Emitter = require("@wcm/module-helper").emitter;

const contentTypes = require("../helpers/contentTypes");
const productHelper = require("../helpers/product");
const docHelper = require("../helpers/doc");

const actions = {
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
	news_item: { // eslint-disable-line camelcase
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
	const contentType = contentTypes.verifyType(contentItem.meta.contentType);

	if (!contentType) {
		return console.log("CONTENTTYPE NOT ALLOWED", contentType);
	}

	const elasticsearch = require("../helpers/elastic");
	const syncAction = verifyAction(action, contentType);
	const fetchAction = verifyAction("fetch", contentType);

	if (!syncAction) {
		return productHelper.fetchProductsForDoc(docHelper.parseDoc(contentType, contentItem), elasticsearch)
			.then((products) => {
				return productHelper.syncProducts(products, elasticsearch);
			});
	}

	if (fetchAction) {
		return fetchAction(contentItem, contentType.type)
			.then((populatedContent) => {
				syncAction(populatedContent, elasticsearch);
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

module.exports.start = () => {
	Emitter.on("content.created", onContentCreated);

	Emitter.on("content.updated", onContentUpdated);

	Emitter.on("content.removed", onContentRemoved);
};

module.exports.stop = () => {
	Emitter.removeListener("content.created", onContentCreated);

	Emitter.removeListener("content.updated", onContentUpdated);

	Emitter.removeListener("content.removed", onContentRemoved);
};
