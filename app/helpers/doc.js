"use strict";

require("rootpath")();
var Q = require("q");
var _ = require("lodash");

var ContentModel = require("app/models/content");
var PopulateHelper = require("app/helpers/populate");
var languageHelper = require("./language");
var contentTypesHelper = require("./contentTypes");

var contentMongoQuery = function() {
	return {
		"meta.contentType": contentTypesHelper().main_documentation,
		"meta.published": true,
		"meta.deleted": false,
	};
};
var contentMongoFields = {
	_id: 0,
	uuid: 1,
	fields: 1,
	"meta.activeLanguages": 1,
	"meta.contentType": "1",
	"meta.created": "1",
	"meta.lastModified": "1",
	"meta.publishDate": 1,
	"meta.slug": 1,
	"meta.taxonomy": 1,
};

function fetchOne(query, fields) {
	return ContentModel
		.findOne(query, fields)
		.populate("meta.contentType")
		.lean()
		.exec()
		.then(function(response) {
			return response;
		}, function(err) {
			throw err;
		});
}

function fetchDoc(doc) {
	return fetchOne(
			_.assign(contentMongoQuery(), {
				uuid: typeof doc === "string" ? doc : doc.uuid,
			}),
			contentMongoFields
		)
		.then(function(item) {
			return PopulateHelper.fields.one(item, {
				populate: "customItems,roadmap",
				lang: languageHelper.currentLanguage(), // @todo: get language from request
			}).then(function(pItem) {
				pItem.customItems = pItem.fields.customItems.map(function(i) {
					return i.value;
				});
				delete pItem.fields.customItems;

				pItem.fields.roadmap = pItem.fields.roadmap.map(function(i) {
					return i.value;
				});

				pItem.fields.productCategory = "main_documentation";

				return pItem;
			});
		}, function(err) {
			throw err;
		});
}

module.exports = {
	fetchDoc: fetchDoc,
};
