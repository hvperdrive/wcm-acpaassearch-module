"use strict";

require("rootpath")();
var Q = require("q");
var _ = require("lodash");

var ContentModel = require("app/models/content");
var PopulateHelper = require("app/helpers/populate");
var index = require("../config/mappings").index;
var languageHelper = require("../helpers/language");
var contentTypes = require("./contentTypes");
var versionHelper = require("./version");

var contentMongoQuery = {
	"meta.contentType": contentTypes.product,
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

function fetchContent(query, fields) {
	return ContentModel
		.findOne(query, fields)
		.populate("meta.contentType")
		.lean()
		.exec()
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

function fetchProducts() {
	return fetchContent(contentMongoQuery, contentMongoFields);
}

function fetchProduct(uuid) {
	return fetchContent(
		_.assign(contentMongoQuery, {
			uuid: uuid,
		}),
		contentMongoFields
	);
}

function transformField(field) {
	return {
		value: field,
	};
}

function transformProduct(product) {
	return {
		uuid: product.uuid,
		fields: {
			productCategory: product.fields.productCategory,
			title: transformField(product.fields.title),
			intro: transformField(product.fields.intro),
			about: transformField(product.fields.about),
			roadmap: product.fields.roadmap.map(function(item) {
				return {
					title: item.fields.title,
					notes: item.fields.notes,
					version: item.fields.version,
				};
			}),
			customItems: product.customItems.map(function(item) {
				return {
					body: item.fields.body,
					title: item.fields.title,
					uuid: item.uuid,
					slug: item.meta.slug,
					visibleFor: item.fields.visibleFor,
					version: item.version,
					api: item.api,
				};
			}),
			versionItems: product.versionItems,
			apiS: product.apiS,
		},
		meta: {
			activeLanguages: product.meta.activeLanguages,
			contentType: typeof product.meta.contentType === "string" ? product.meta.contentType : contentTypes.verifyType(product.meta.contentType).id,
			created: product.meta.created,
			lastModified: product.meta.lastModified,
			publishDate: product.meta.publishDate,
			slug: product.meta.slug[language], // @todo: return slug for active language
			taxonomy: {
				tags: product.meta.taxonomy.tags,
			},
		},
	};
}

function productExists(uuid, elasticsearch) {
	return elasticsearch.exists({
		index: index,
		type: "product",
		id: uuid,
	});
}

function syncProduct(product, elasticsearch) {
	return productExists(product.uuid, elasticsearch)
		.then(function(exists) {
			return exists ? updateProduct(product, elasticsearch) : createProduct(product, elasticsearch);
		});
}

function createProduct(product, elasticsearch) {
	return elasticsearch.create({
		index: index,
		type: "product",
		id: product.uuid,
		body: transformProduct(product),
	});
}

function updateProduct(product, elasticsearch) {
	return elasticsearch.update({
		index: index,
		type: "product",
		id: product.uuid,
		body: transformProduct(product), // @todo: partial update
	});
}

function removeProduct(product, elasticsearch) {
	return elasticsearch.delete({
		index: index,
		type: "product",
		id: product.uuid,
	});
}

function syncProducts(syncNonModified, products, elasticsearch) {
	return Q.all(products.map(function(product) {
		return syncProduct(product, elasticsearch);
	}));
}

module.exports = {
	fetchProduct: fetchProduct,
	fetchProducts: fetchProducts,
	syncProduct: syncProduct,
	syncProducts: syncProducts,
	updateProduct: updateProduct,
	removeProduct: removeProduct,
};
