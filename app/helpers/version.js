"use strict";

var Q = require("q");

var ContentModel = require("app/models/content");
var versionId = require("./contentTypes").version;
var apiId = require("./contentTypes").api;

function fetchVersions() {
	return ContentModel.find({
		"meta.contentType": versionId,
	}, {
		_id: 0,
		uuid: 1,
		fields: 1,
		"meta.contentType": 1,
	})
	.populate("meta.contentType")
	.lean()
	.exec();
}

function fetchApis(version) {
	return ContentModel.find({
		"meta.contentType": apiId,
	}, {
		_id: 0,
		uuid: 1,
		fields: 1,
	})
	.populate("fields.customItems")
	.lean()
	.exec();
}

function syncVersion(version) {
	// @todo: fetchApis
	return Q.resolve(version);
}

function syncVersions(versions, syncNonModified) {
	return Q.all(versions.map(function(version) {
		return syncVersion(version, syncNonModified);
	}));
}

module.exports = {
	fetchVersions: fetchVersions,
	syncVersion: syncVersion,
	syncVersions: syncVersions,
};
