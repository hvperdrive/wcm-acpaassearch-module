"use strict";

require("rootpath")();
var Q = require("q");
var _ = require("lodash");

var productHelper = require("./product");

module.exports = function() {
	return productHelper
		.fetchProducts()
		.then(productHelper.syncProducts)
		.catch(function(err) {
			throw err;
		});
};
