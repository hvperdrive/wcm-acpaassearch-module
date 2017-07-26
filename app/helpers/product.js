"use strict";

require("rootpath")();
var Q = require("q");
var _ = require("lodash");

var ContentModel = require("app/models/content");
var PopulateHelper = require("app/helpers/populate");
var contentTypes = require("./contentTypes");
var index = require("../config/mappings").index;

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
			});
		}, function(err) {
			throw err;
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

function transformProduct(product) {
	return {
		uuid: product.uuid,
		fields: {
			title: product.fields.title,
			intro: product.fields.intro,
			about: product.fields.about,
			roadmap: product.fields.roadmap,
			customItems: product.fields.customItems,
		},
		meta: {
			activeLanguages: product.meta.activeLanguages,
			contentType: typeof product.meta.contentType === "string" ? product.meta.contentType : contentTypes.verifyType(product.meta.contentType).id,
			created: product.meta.created,
			lastModified: product.meta.lastModified,
			publishDate: product.meta.publishDate,
			slug: product.meta.slug.nl, // @todo: return slug for active language
			taxonomy: {
				tags: product.meta.taxonomy.tags,
			},
		},
	};
}

function syncProduct(product, elasticsearch) {
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
