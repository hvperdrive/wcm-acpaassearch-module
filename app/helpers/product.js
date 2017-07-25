"use strict";

var Q = require("q");

var ContentModel = require("app/models/content");
var productId = require("./contentTypes").product;
var elasticsearch = require("./elastic").client;
var index = require("../config/mappings").index;

function fetchProducts() {
	return ContentModel.find({
		"meta.contentType": productId,
	}, {
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
	})
	.populate("meta.contentType")
	.populate("fields.roadmap")
	.lean()
	.exec();
}

function syncProduct(product) {
	return elasticsearch.create({
		index: index,
		type: "product",
		id: product.uuid,
		body: product,
	});
}

function updateProduct(product) {
	return elasticsearch.update({
		index: index,
		type: "product",
		id: product.uuid,
		body: product, // @todo: partial update
	});
}

function removeProduct(product) {
	return elasticsearch.delete({
		index: index,
		type: "product",
		id: product.uuid,
	});
}

function syncProducts(syncNonModified, products) {
	return Q.all(products.map(function(product) {
		return syncProduct(product, syncNonModified);
	}));
}

module.exports = {
	fetchProducts: fetchProducts,
	syncProduct: syncProduct,
	syncProducts: syncProducts,
	updateProduct: updateProduct,
	removeProduct: removeProduct,
};
