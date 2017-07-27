"use strict";

var Q = require("q");
var _ = require("lodash");

var ContentModel = require("app/models/content");
var contentTypes = require("./contentTypes");
var language = require("../config/language").lang;
var index = require("../config/mappings").index;
var apiHelper = require("./api");
var populateHelper = require("app/helpers/populate");

var contentMongoQuery = {
	"meta.contentType": contentTypes.version,
};
var contentMongoFields = {
	_id: 0,
	uuid: 1,
	fields: 1,
	"meta.contentType": 1,
};

function fetchContent(query, fields) {
	return ContentModel
		.findOne(query, fields)
		.populate("meta.contentType")
		.lean()
		.exec();
}

function fetchVersion(uuid) {
	return fetchContent(
		_.assign(contentMongoQuery, {
			uuid: uuid,
		}),
		contentMongoFields
	).then(function(response) {
		return apiHelper.fetchApiS(response.fields.apiS.map(function(api) {
			return api.value;
		}));
	});
}

function fetchVersions(uuid, product) {
	var settings = populateHelper.fields.getPopulatorConfig.view({
		lang: language,
		uuid: uuid,
		"view.product_versions.product": product,
	});

	settings.populateFields.viewsPopulate = "false";

	return populateHelper.fields.types.defaults["view-reference"]({
		uuid: uuid,
	}, null, settings, settings.populateFields)
	.then(function(viewResult) {
		var result = {
			versionItems: [],
			apiS: [],
			customItems: []
		};

		if (viewResult.total === 0) {
			return result;
		}

		result.versionItems = _.flatten(viewResult.data.map(function(version) {
			return ["gettingStarted", "releaseNotes", "features", "architecture", "faq"].map(function(field) {
				return {
					version: version.fields.versionLabel,
					slug: field,
					value: version.fields[field]
				};
			});
		}));

		var versionApiS = _.flattenDeep(viewResult.data.map(function(version) {
			return version.fields.apiS.map(function(api) {
				return {
					version: version.fields.versionLabel,
					api: api.value,
				};
			});
		}));
		var uuids = versionApiS.map(function(version) {
			return version.api;
		});

		if (!uuids.length) {
			return result;
		}

		return apiHelper.fetchApiS(uuids)
			.then(function(response) {
				result.apiS = response.apiS.map(function(api) {
					var version = versionApiS.find(function(a) {
						return a.api === api.uuid;
					}) || {};

					return {
						version: version.version,
						apiSlug: api.meta.slug[language],
						slug: "about",
						value: api.fields.about,
						title: api.fields.title,
					};
				});

				result.customItems = response.customItems.map(function(item) {
					var version = versionApiS.find(function(version) {
						return version.api === item.apiUuid;
					}) || {};

					item.version = version.version;

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

function transformVersion(version) {
	return {
		uuid: version.uuid,
		fields: {
			versionLabel: version.fields.versionLabel,
			architecture: version.fields.architecture,
			faq: version.fields.faq,
			features: version.fields.features,
			gettingStarted: version.fields.gettingStarted,
			releaseNotes: version.fields.releaseNotes,
			apiS: version.fields.apiS,
		},
		meta: {
			contentType: contentTypes.verifyType(version.meta.contentType).id,
		},
	};
}

function syncVersion(version, elasticsearch) {
	return elasticsearch.create({
		index: index,
		type: "version",
		id: version.uuid,
		body: transformVersion(version),
	});
}

function updateVersion(version, elasticsearch) {
	return elasticsearch.update({
		index: index,
		type: "version",
		id: version.uuid,
		body: transformVersion(version), // @todo: partial update
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
	fetchVersion: fetchVersion,
	fetchVersions: fetchVersions,
	syncVersion: syncVersion,
	syncVersions: syncVersions,
	updateVersion: updateVersion,
	removeVersion: removeVersion,
};
