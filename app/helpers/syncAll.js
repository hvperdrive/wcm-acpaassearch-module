"use strict";

require("rootpath")();

var productHelper = require("./product");

module.exports = function() {
	var elasticsearch = require("./elastic");

	return productHelper
		.fetchProducts()
		.then(function(products) {
			return productHelper.syncProducts(products, elasticsearch);
		}, function(err) {
			throw err;
		})
		.catch(function(err) {
			throw err;
		});
};
