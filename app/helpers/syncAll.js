"use strict";

require("rootpath")();
var Q = require("q");
var _ = require("lodash");

var productHelper = require("./product");
var versionHelper = require("./version");

function syncProductsVersions(syncNonModified, products) {
	return Q.all(products.map(function(product) {
		return versionHelper
			.fetchVersions(product)
			.then(versionHelper.syncVersions.bind(null, syncNonModified))
			.catch(function(err) {
				throw err;
			});
	}));
}

module.exports = function(syncNonModified) {
	return productHelper
		.fetchProducts()
		.then(productHelper.syncProducts.bind(null, syncNonModified))
		.then(syncProductsVersions.bind(null, syncNonModified))
		.catch(function(err) {
			throw err;
		});
};
