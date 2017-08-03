"use strict";

require("rootpath")();
var _ = require("lodash");

var productHelper = require("./product");
var docHelper = require("./doc");

function errHandler(err) {
	throw err;
}

module.exports = function() {
	var elasticsearch = require("./elastic");

	return productHelper
		.fetchProducts()
		.then(function(products) {
			return docHelper.fetchDocs("news_item")
				.then(function(news) {
					return docHelper.fetchDocs("main_documentation")
						.then(function(docs) {
							return _.concat(products, news, docs);
						}, errHandler);
				}, errHandler);
		})
		.then(function(products) {
			return productHelper.syncProducts(products, elasticsearch);
		}, errHandler)
		.catch(errHandler);
};
