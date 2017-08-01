"use strict";

require("rootpath")();
var Q = require("q");
var _ = require("lodash");

var ContentModel = require("app/models/content");
var PopulateHelper = require("app/helpers/populate");
var languageHelper = require("./language");
var contentTypesHelper = require("./contentTypes");
var versionHelper = require("./version");
var matcher = require("./matcher");

var contentMongoQuery = function() {
	return {
		"meta.contentType": contentTypesHelper().product,
		"meta.published": true,
		"meta.deleted": false,
	};
};
var contentMongoFields = {
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

function fetchOne(query, fields) {
	return ContentModel
		.findOne(query, fields)
		.populate("meta.contentType")
		.lean()
		.exec()
		.then(function(response) {
			return response;
		}, function(err) {
			throw err;
		});
}

function fetchContent(query, fields) {
	return ContentModel
		.find(query, fields)
		.populate("meta.contentType")
		.lean()
		.exec()
		.then(function(response) {
			return response;
		}, function(err) {
			throw err;
		});
}

function fetchProducts() {
	return fetchContent(contentMongoQuery(), {
		uuid: 1,
	})
	.then(function(products) {
		return products.map(function(product) {
			return product.uuid;
		});
	}, function(err) {
		throw err;
	});
}

function fetchProduct(product) {
	return fetchOne(
			_.assign(contentMongoQuery(), {
				uuid: typeof product === "string" ? product : product.uuid,
			}),
			contentMongoFields
		)
		.then(function(item) {
			return PopulateHelper.fields.one(item, {
				populate: "customItems,roadmap",
				lang: languageHelper.currentLanguage(), // @todo: get language from request
			}).then(function(pItem) {
				pItem.customItems = pItem.fields.customItems.map(function(i) {
					return i.value;
				});
				delete pItem.fields.customItems;

				pItem.fields.roadmap = pItem.fields.roadmap.map(function(i) {
					return i.value;
				});

				return pItem;
			});
		}, function(err) {
			throw err;
		})
		.then(function(item) {
			return versionHelper.fetchVersions(item.fields.versionsOverview.uuid, item.uuid)
				.then(function(response) {
					item.versionItems = response.versionItems;
					item.apiS = response.apiS;
					item.customItems = item.customItems.concat(response.customItems).filter(function(i) {
						return !!_.get(i, "fields.body");
					});

					return item;
				}, function(err) {
					throw err;
				});
		});
}

function transformField(field) {
	return {
		value: languageHelper.verifyMultilanguage(field),
	};
}

function transformProduct(product) {
	var meta = {
		activeLanguages: product.meta.activeLanguages,
		contentType: typeof product.meta.contentType === "string" ? product.meta.contentType : contentTypesHelper.verifyType(product.meta.contentType).id,
		created: product.meta.created,
		lastModified: product.meta.lastModified,
		publishDate: product.meta.publishDate,
		slug: languageHelper.verifyMultilanguage(product.meta.slug), // @todo: return slug for active language
		taxonomy: {
			tags: product.meta.taxonomy.tags,
		},
	};
	var roadmap = _.get(product, "fields.roadmap", []).map(function(item) {
		return {
			uuid: item.uuid,
			title: languageHelper.verifyMultilanguage(item.fields.title),
			notes: languageHelper.verifyMultilanguage(item.fields.notes),
			version: languageHelper.verifyMultilanguage(item.fields.version),
		};
	});
	var customItems = _.get(product, "customItems", []).map(function(item) {
		return {
			body: languageHelper.verifyMultilanguage(item.fields.body),
			title: languageHelper.verifyMultilanguage(item.fields.title),
			uuid: item.uuid,
			slug: languageHelper.verifyMultilanguage(item.meta.slug),
			visibleFor: item.fields.visibleFor,
			version: item.version,
			api: item.api,
		};
	});
	var fields = {
		productCategory: product.fields.productCategory,
		title: transformField(product.fields.title),
		intro: transformField(product.fields.intro),
		about: transformField(product.fields.about),
		gettingStarted: transformField(product.fields.gettingStarted),
		roadmap: roadmap,
		customItems: customItems,
		versionItems: product.versionItems,
		apiS: product.apiS,
	};

	return {
		uuid: product.uuid,
		fields: fields,
		meta: meta
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
	return productExists(product.uuid, elasticsearch, "product")
		.then(function(exists) {
			return exists ? updateProduct(product, elasticsearch) : createProduct(product, elasticsearch);
		}, function(err) {
			throw err;
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
	return Q.all(products.map(function(product) {
		return fetchProduct(product)
			.then(function(populatedProduct) {
				return syncProduct(populatedProduct, elasticsearch);
			}, function(err) {
				throw err;
			});
	}));
}

function fetchProductsForDoc(doc, elasticsearch) {
	var query = matcher.getMatcherForType(contentTypesHelper.verifyType(doc.meta.contentType), doc);

	return elasticsearch.client.search({
		index: elasticsearch.index,
		type: "product",
		body: query
	}).then(function(doc) {
		return _.get(doc, "hits.hits", []).map(function(hit) {
			return _.get(hit, "_source.uuid", "");
		});
	}, function(err) {
		throw err;
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
