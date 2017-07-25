"use strict";

require("rootpath")();
var Q = require("q");
var _ = require("lodash");
var async = require("async");

var ContentModel = require("app/models/content");
var productId = require("./contentTypes").product;
var syncProduct = require("./sync").product;

module.exports = function(syncNonModified) {
	var d = Q.defer();
	var products = [];

	return ContentModel.find({
		"meta.contentType": productId
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
		"meta.taxonomy": 1
	})
	.populate("meta.contentType")
	.lean()
	.exec()
	.then(
		function onSuccess(response) {
			products = response;

			async.parallel(products.map(function (product) {
				return function (callback) {
					syncProduct(product)
						.then(function(response) {
							callback(null, response);
						}, function(err) {
							callback(err);
						});
				};
			}), function (err, response) {
				if (err) {
					return d.reject(err);
				}

				d.resolve(response);
			});
		},
		function onError(responseError) {
			throw responseError;
		}
	);

	return d.promise;
};
