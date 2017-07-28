"use strict";

require("rootpath")();

var productHelper = require("./product");

module.exports = function() {
	return productHelper
		.fetchProducts()
		.then(productHelper.syncProducts)
		.catch(function(err) {
			throw err;
		});
};
