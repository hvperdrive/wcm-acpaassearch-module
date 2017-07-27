"use strict";

var _ = require("lodash");

var ContentModel = require("app/models/content");
var contentTypes = require("./contentTypes");
var customItemsHelper = require("./customItems");
var language = require("../config/language").lang;

var contentMongoQuery = {
	"meta.contentType": contentTypes.api,
};
var contentMongoFields = {
	_id: 0,
	uuid: 1,
	fields: 1,
	"meta.contentType": 1,
	"meta.slug": 1
};

function fetchApiS(uuids) {
	return ContentModel.find(_.assign(contentMongoQuery, {
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
					api: api.meta.slug[language],
					apiUuid: api.uuid,
					uuid: item.value,
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

module.exports = {
	fetchApiS: fetchApiS,
};
