const _ = require("lodash");
const path = require("path");
const runQueue = require("./queue").runQueue;

const ContentModel = require(path.join(process.cwd(), "app/models/content"));
const PopulateHelper = require(path.join(process.cwd(), "app/helpers/populate"));
const languageHelper = require("./language");
const contentTypesHelper = require("./contentTypes");
const versionHelper = require("./version");
const matcher = require("./matcher");
const fieldHelper = require("./field");
const contentTypes = require("./contentTypes")();

const contentMongoQuery = () => ({
	"meta.contentType": contentTypesHelper().product,
	"meta.published": true,
	"meta.deleted": false,
});
const contentMongoFields = {
	_id: 0,
	uuid: 1,
	fields: 1,
	"meta.activeLanguages": 1,
	"meta.contentType": "1",
	"meta.created": "1",
	"meta.lastModified": "1",
	"meta.publishDate": 1,
	"meta.slug": 1,
	"meta.taxonomy": 1,
};

// Uitbreding: deze waarden vanuit WCM taxonomy lijsten halen
const contentTypeTagsMap = Object.freeze({
	"product": ["products", "producten", "componenten", "compontents"],
	"product_doc_version": ["versies", "versions", "producten", "products", "componenten", "components"],
	"api": ["api", "producten", "products", "componenten", "components"],
	"timeline": ["tijdlijn", "tijdslijn", "timeline", "componenten", "components"],
	"main_documentation": ["main_documentation", "documentatie", "algemene documentatie"],
	"news_item": ["news", "nieuws"],
	"showcase_item": ["showcase", "uitgelicht"],
});

function verifyUuid(product) {
	return typeof product === "string" ? product : product.uuid;
}

function fetchOne(query, fields) {
	return ContentModel
		.findOne(query, fields)
		.populate("meta.contentType")
		.lean()
		.exec();
}

function fetchContent(query, fields) {
	return ContentModel
		.find(query, fields)
		.populate("meta.contentType")
		.lean()
		.exec();
}

function fetchProducts(uuids) {
	const populatedProducts = [];
	const query = contentMongoQuery();

	if (uuids) {
		query.uuid = { $in: uuids };
	}

	return fetchContent(query, contentMongoFields)
		.then((products) => {
			return runQueue(products.map((product) => {
				return () => populateProduct(product)
					.then((populated) => {
						populatedProducts.push(populated);
					});
			}));
		})
		.then(() => populatedProducts);
}

function fetchProduct(product) {
	return fetchOne(
		_.assign(contentMongoQuery(), {
			uuid: verifyUuid(product),
		}),
		contentMongoFields
	)
	.then(populateProduct);
}

function populateProduct(product) {
	return PopulateHelper.fields.one(product, {
		populate: "customItems,hiddenItems,roadmap",
		lang: languageHelper.currentLanguage(), // @todo: get language from request
	}).then((pItem) => {
		const customItems = _.get(pItem, "fields.customItems", []);
		const hiddenItems = _.get(pItem, "fields.hiddenItems", []);

		pItem.customItems = customItems.concat(hiddenItems).map((i) => i.value);
		delete pItem.fields.customItems;
		delete pItem.fields.hiddenItems;

		pItem.fields.roadmap = _.get(pItem, "fields.roadmap", []).map((i) => i.value);

		return pItem;
	})
	.then((item) => {
		if (!_.get(item, "fields.versionsOverview.uuid")) {
			return item;
		}

		return versionHelper.fetchVersions(item.fields.versionsOverview.uuid, item.uuid)
			.then((response) => {
				item.versionItems = response.versionItems;
				item.apiS = response.apiS;
				item.customItems = item.customItems.concat(response.customItems).filter((i) => {
					return !!_.get(i, "fields.body");
				});

				return item;
			});
	});
}

function transformField(field) {
	return {
		value: languageHelper.verifyMultilanguage(field),
	};
}

function getTagsBasedOnCT(contentType) {
	return { value: contentTypeTagsMap[contentType] };
}

function transformProduct(product) {
	const contentTypeString = typeof product.meta.contentType === "string" ? product.meta.contentType : contentTypesHelper.verifyType(product.meta.contentType)._id;

	const meta = {
		activeLanguages: product.meta.activeLanguages,
		contentType: contentTypeString,
		created: product.meta.created,
		lastModified: product.meta.lastModified,
		publishDate: product.meta.publishDate,
		slug: languageHelper.verifyMultilanguage(product.meta.slug), // @todo: return slug for active language
		taxonomy: {
			tags: product.meta.taxonomy.tags,
		},
		tags: getTagsBasedOnCT(contentTypeString),
	};
	const roadmap = _.get(product, "fields.roadmap", []).map((item) => ({
		uuid: item.uuid,
		title: languageHelper.verifyMultilanguage(item.fields.title),
		notes: fieldHelper.striptags(languageHelper.verifyMultilanguage(item.fields.notes)),
		version: languageHelper.verifyMultilanguage(item.fields.version),
	}));
	const customItems = _.get(product, "customItems", []).map((item) => ({
		body: fieldHelper.striptags(languageHelper.verifyMultilanguage(item.fields.body)),
		title: languageHelper.verifyMultilanguage(item.fields.title),
		uuid: item.uuid,
		slug: languageHelper.verifyMultilanguage(item.meta.slug),
		visibleFor: item.fields.visibleFor,
		version: item.version,
		api: item.api,
	}));
	const fields = {
		productCategory: product.fields.productCategory,
		title: transformField(product.fields.title),
		intro: transformField(fieldHelper.striptags(product.fields.intro)),
		about: transformField(fieldHelper.striptags(product.fields.about)),
		gettingStarted: transformField(fieldHelper.striptags(product.fields.gettingStarted)),
		body: transformField(fieldHelper.striptags(product.fields.body)),
		roadmap: roadmap,
		customItems: customItems,
		versionItems: product.versionItems,
		apiS: product.apiS,
	};

	return {
		uuid: product.uuid,
		fields: fields,
		meta: meta,
	};
}

function productExists(uuid, elasticsearch) {
	return elasticsearch.client.exists({
		index: elasticsearch.index,
		type: "product",
		id: uuid,
	});
}

function syncProduct(product, elasticsearch) {
	return productExists(verifyUuid(product), elasticsearch, "product")
		.then((exists) => {
			return exists ? updateProduct(product, elasticsearch) : createProduct(product, elasticsearch);
		});
}

function createProduct(product, elasticsearch) {
	return elasticsearch.client.create({
		index: elasticsearch.index,
		type: "product",
		id: product.uuid,
		body: transformProduct(product),
	});
}

function updateProduct(product, elasticsearch) {
	return elasticsearch.client.update({
		index: elasticsearch.index,
		type: "product",
		id: product.uuid,
		body: {
			doc: transformProduct(product), // @todo: partial update
		},
	});
}

function removeProduct(product, elasticsearch) {
	return elasticsearch.client.delete({
		index: elasticsearch.index,
		type: "product",
		id: product.uuid,
	});
}

function syncProducts(products, elasticsearch) {
	return runQueue(products.map((product) => {
		return () => syncProduct(product, elasticsearch);
	}));
}

function fetchProductsForDoc(doc, elasticsearch) {
	const query = matcher.getMatcherForType(contentTypesHelper.verifyType(doc.meta.contentType), doc);

	return elasticsearch.client.search({
		index: elasticsearch.index,
		type: "product",
		body: query,
	}).then((result) => {
		const products = _.get(result, "hits.hits", []).map((hit) => {
			return _.get(hit, "_source.uuid", "");
		});

		return fetchProducts(products);
	});
}

module.exports = {
	fetchProduct: fetchProduct,
	fetchProducts: fetchProducts,
	syncProduct: syncProduct,
	syncProducts: syncProducts,
	updateProduct: updateProduct,
	removeProduct: removeProduct,
	fetchProductsForDoc: fetchProductsForDoc,
};
