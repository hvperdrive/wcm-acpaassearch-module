"use strict";

require("rootpath")();
var Q = require("q");
var _ = require("lodash");

var ContentModel = require("app/models/content");
var PopulateHelper = require("app/helpers/populate");
var languageHelper = require("../helpers/language");
var contentTypes = require("./contentTypes");
var versionHelper = require("./version");

var contentMongoQuery = function() {
	return {
		"meta.contentType": contentTypes().product,
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

function fetchProduct(uuid) {
	return fetchOne(
			_.assign(contentMongoQuery(), {
				uuid: uuid,
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
					slug: languageHelper.verifyMultilanguage(item.meta.slug), // @todo: return slug for active language
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
			slug: languageHelper.verifyMultilanguage(product.meta.slug), // @todo: return slug for active language
			taxonomy: {
				tags: product.meta.taxonomy.tags,
			},
		},
	};
}

function productExists(uuid, elasticsearch) {
	var d = Q.defer();

	elasticsearch.client.exists({
		index: elasticsearch.index,
		type: "product",
		id: uuid,
	}).then(function(err, exists) {
		d.resolve(exists);
	}, function(err, response) {
		if (err) {
			throw err;
		}

		d.reject(response);
	});

	return d.promise;
}

function syncProduct(product, elasticsearch) {
	return productExists(product.uuid, elasticsearch)
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
		body: transformProduct(product), // @todo: partial update
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

module.exports = {
	fetchProduct: fetchProduct,
	fetchProducts: fetchProducts,
	syncProduct: syncProduct,
	syncProducts: syncProducts,
	updateProduct: updateProduct,
	removeProduct: removeProduct,
};
