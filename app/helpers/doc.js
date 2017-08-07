"use strict";

require("rootpath")();
var runQueue = require("./queue").runQueue;
var _ = require("lodash");

var ContentModel = require("app/models/content");
var PopulateHelper = require("app/helpers/populate");
var languageHelper = require("./language");
var contentTypesHelper = require("./contentTypes");

var contentMongoQuery = function(type) {
	return {
		"meta.contentType": contentTypesHelper()[type],
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

function errHandler(err) {
	throw err;
}

function fetchOne(query, fields) {
	return ContentModel
		.findOne(query, fields)
		.populate("meta.contentType")
		.lean()
		.exec();
}

function fetchContent(query, fields) {
	return ContentModel
		.find(query, fields)
		.populate("meta.contentType")
		.lean()
		.exec();
}

function fetchDoc(doc, type) {
	return fetchOne(
			_.assign(contentMongoQuery(type), {
				uuid: typeof doc === "string" ? doc : doc.uuid,
			}),
			contentMongoFields
		)
		.then(parseDoc.bind(null, type));
}

function parseDoc(type, doc) {
	return PopulateHelper.fields.one(doc, {
		populate: "customItems,roadmap",
		lang: languageHelper.currentLanguage(), // @todo: get language from request
	}).then(function(pItem) {
		pItem.customItems = _.get(pItem, "fields.customItems", []).map(function(i) {
			return i.value;
		});
		delete pItem.fields.customItems;

		pItem.fields.roadmap = _.get(pItem, "fields.roadmap", []).map(function(i) {
			return i.value;
		});

		pItem.fields.productCategory = type;

		return pItem;
	}, errHandler);
}

function fetchDocs(contentType) {
	var parsed = [];

	return fetchContent(
		contentMongoQuery(contentType),
		contentMongoFields
	)
	.then(function(docs) {
		return runQueue(docs.map(function(doc) {
			return function() {
				return parseDoc(contentType, doc)
					.then(function(pDoc) {
						parsed.push(pDoc);
					}, errHandler);
			};
		}));
	}, errHandler)
	.then(function() {
		return parsed;
	}, errHandler);
}

module.exports = {
	fetchDoc: fetchDoc,
	fetchDocs: fetchDocs,
};
