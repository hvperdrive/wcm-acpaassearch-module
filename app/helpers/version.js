"use strict";

var Q = require("q");

var ContentModel = require("app/models/content");
var versionId = require("./contentTypes").version;
var apiId = require("./contentTypes").api;
var index = require("../config/mappings").index;

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
	return elasticsearch.create({
		index: index,
		type: "version",
		id: version.uuid,
		body: version,
	});
}

function updateVersion(version, elasticsearch) {
	return elasticsearch.update({
		index: index,
		type: "version",
		id: version.uuid,
		body: version, // @todo: partial update
	});
}

function removeVersion(version, elasticsearch) {
	return elasticsearch.delete({
		index: index,
		type: "version",
		id: version.uuid,
	});
}

function syncVersions(syncNonModified, versions, elasticsearch) {
	return Q.all(versions.map(function(version) {
		return syncVersion(version, elasticsearch);
	}));
}

module.exports = {
	fetchVersions: fetchVersions,
	syncVersion: syncVersion,
	syncVersions: syncVersions,
	updateVersion: updateVersion,
	removeVersion: removeVersion,
};
