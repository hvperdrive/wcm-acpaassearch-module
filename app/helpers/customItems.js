"use strict";

var Q = require("q");
var _ = require("lodash");

var ContentModel = require("app/models/content");
var contentTypes = require("./contentTypes");
var language = require("../config/language").lang;

var contentMongoQuery = {
	"meta.contentType": contentTypes.customItem,
};
var contentMongoFields = {
	_id: 0,
	uuid: 1,
	fields: 1,
	"meta.contentType": 1,
};

function fetchCustomItems(uuids) {
	return ContentModel.find(_.assign(contentMongoQuery, {
		uuid: {
			$in: uuids,
		},
	}), contentMongoFields)
	.lean()
	.exec()
	.then(function(items) {
		return items.map(function(item) {
			item.fields.body = item.fields.body[language];
			return item;
		});
	}, function(err) {
		throw err;
	});
}

module.exports = {
	fetchCustomItems: fetchCustomItems,
};
