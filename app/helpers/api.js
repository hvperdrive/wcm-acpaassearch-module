"use strict";

var _ = require("lodash");

var ContentModel = require("app/models/content");
var contentTypes = require("./contentTypes");
var customItemsHelper = require("./customItems");
var languageHelper = require("./language");

var contentMongoQuery = function() {
	return {
		"meta.contentType": contentTypes().api,
		"meta.published": true,
		"meta.deleted": false,
	};
};
var contentMongoFields = {
	_id: 0,
	uuid: 1,
	fields: 1,
	"meta.contentType": 1,
	"meta.slug": 1,
};

function fetchApiS(uuids) {
	return ContentModel.find(_.assign(contentMongoQuery(), {
		uuid: {
			$in: uuids,
		},
	}), contentMongoFields)
	.lean()
	.exec()
	.then(function(apiS) {
		var result = {
			apiS: apiS,
			customItems: [],
		};

		var apiCustomItems = _.flattenDeep(apiS.map(function(api) {
			return api.fields.customItems.map(function(item) {
				return {
					api: languageHelper.verifyMultilanguage(api.meta.slug),
					apiUuid: api.uuid,
					uuid: item.value,
					visibleFor: api.fields.visibleFor,
				};
			});
		}));
		var apiSToFetch = apiCustomItems.map(function(item) {
			return item.uuid;
		});

		if (!apiSToFetch.length) {
			return result;
		}

		return customItemsHelper.fetchCustomItems(apiSToFetch)
			.then(function(customItems) {
				result.customItems = customItems.map(function(item) {
					var api = (apiCustomItems.find(function(i) {
						return i.uuid === item.uuid;
					}) || {});

					item.api = api.api;
					item.apiUuid = api.apiUuid;
					item.fields.visibleFor = checkVisibility([item.fields.visibleFor, api.visibleFor]);

					return item;
				});
				return result;
			}, function(err) {
				throw err;
			});
	}, function(err) {
		throw err;
	});
}

function checkVisibility(fields) {
	var values = ["allProfiles", "aProfiles", "mProfiles"];

	var value = fields.reduce(function(acc, field) {
		var fieldIndex = values.indexOf(field);

		return fieldIndex > acc ? fieldIndex : acc;
	}, -1);

	return value >= 0 ? values[value] : "invisible";
}

module.exports = {
	fetchApiS: fetchApiS,
};
