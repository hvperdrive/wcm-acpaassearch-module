"use strict";

var Q = require("q");

var ContentModel = require("app/models/content");
var productId = require("./contentTypes").product;

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
	return Q.resolve(product);
}

function syncProducts(products, syncNonModified) {
	return Q.all(products.map(function(product) {
		return syncProduct(product, syncNonModified);
	}));
}

module.exports = {
	fetchProducts: fetchProducts,
	syncProduct: syncProduct,
	syncProducts: syncProducts,
};
