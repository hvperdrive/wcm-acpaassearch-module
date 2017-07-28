"use strict";

require("rootpath")();
var _ = require("lodash");

var ContentTypeModel = require("app/models/contentType");
var variablesHelper = require("./variables");

var contentTypes = {};

var toList = function(types) {
	return Object.keys(types).reduce(function(acc, curr) {
		acc.push({
			type: curr,
			id: types[curr],
		});

		return acc;
	}, []);
};

module.exports = function getContentTypes() {
	return contentTypes;
};

module.exports.reload = function() {
	variablesHelper.reload()
		.then(function(variables) {
			var safeLabels = _.get(variables, "acpaassearch.variables.contentTypes", "").split(",");

			ContentTypeModel
				.find({
					"meta.deleted": false,
					"meta.safeLabel": {
						$in: safeLabels,
					},
				})
				.lean()
				.exec()
				.then(function(types) {
					contentTypes = types.reduce(function(acc, type) {
						acc[type.meta.safeLabel] = type._id.toString();
						return acc;
					}, {});
				}, function(err) {
					throw err;
				});
		});
};

module.exports.verifyType = function(type) {
	type = typeof type === "string" ? type : type._id;

	return toList(contentTypes).find(function(t) {
		return t.id === type.toString();
	});
};
