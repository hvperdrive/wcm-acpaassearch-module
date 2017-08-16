"use strict";

require("rootpath")();
var runQueue = require("./queue").runQueue;
var _ = require("lodash");

var ContentModel = require("app/models/content");
var PopulateHelper = require("app/helpers/populate");
var languageHelper = require("./language");
var contentTypesHelper = require("./contentTypes");
var versionHelper = require("./version");
var apiHelper = require("./api");

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
		.then(populateDoc.bind(null, type));
}

function populateDoc(type, doc) {
	return PopulateHelper.fields.one(doc, {
		populate: "customItems,roadmap",
		lang: languageHelper.currentLanguage(), // @todo: get language from request
	}).then(function(item) {
		return parseDoc(type, item);
	}, errHandler);
}

function parseDoc(type, doc) {
	var item = _.cloneDeep(doc);

	if (!doc.hasOwnProperty("customItems")) {
		item.customItems = _.get(item, "fields.customItems", []).map(function(i) {
			return i.value;
		});
		delete item.fields.customItems;
	}

	item.fields.roadmap = _.get(item, "fields.roadmap", []).map(function(i) {
		return typeof i === "string" ? i : i.value;
	});

	item.fields.productCategory = contentTypesHelper.verifyType(type) || type;

	item.fields.versionLabel = getVersionLabel(type, item);

	return item;
}

function getVersionLabel(type, doc) {
	var contentTypes = contentTypesHelper();

	switch (_.get(contentTypesHelper.verifyType(type), "_id")) {
		case contentTypes.api:
			return apiHelper.getVersionLabel(doc);
		case contentTypes.product_doc_version:
			return versionHelper.getVersionLabel(doc);
		default:
			return "";
	}
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
				return populateDoc(contentType, doc)
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
	populateDoc: populateDoc,
	getVersionLabel: getVersionLabel,
	parseDoc: parseDoc,
};
