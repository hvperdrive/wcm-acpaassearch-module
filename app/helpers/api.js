const _ = require("lodash");
const path = require("path");

const ContentModel = require(path.join(process.cwd(), "app/models/content"));
const contentTypes = require("./contentTypes");
const customItemsHelper = require("./customItems");
const languageHelper = require("./language");

const contentMongoQuery = function() {
	return {
		"meta.contentType": contentTypes().api,
		"meta.published": true,
		"meta.deleted": false,
	};
};

const contentMongoFields = {
	_id: 0,
	uuid: 1,
	fields: 1,
	"meta.contentType": 1,
	"meta.slug": 1,
};

function parseCustomItems(items, api) {
	return items.map(function(item) {
		return {
			api: languageHelper.verifyMultilanguage(api.meta.slug),
			apiUuid: api.uuid,
			uuid: item.value,
			visibleFor: api.fields.visibleFor,
		};
	});
}

function fetchApiS(uuids) {
	return ContentModel.find(_.assign(contentMongoQuery(), {
		uuid: {
			$in: uuids,
		},
	}), contentMongoFields)
	.lean()
	.exec()
	.then(function(apiS) {
		let result = {
			apiS: apiS,
			customItems: [],
		};

		let apiCustomItems = _.flattenDeep(apiS.map(function(api) {
			let customItems = _.get(api, "fields.customItems", []);
			let hiddenItems = _.get(api, "fields.hiddenItems", []);

			return parseCustomItems(customItems.concat(hiddenItems), api);
		}));
		let apiSToFetch = apiCustomItems.map(function(item) {
			return item.uuid;
		});

		if (!apiSToFetch.length) {
			return result;
		}

		return customItemsHelper.fetchCustomItems(apiSToFetch)
			.then(function(customItems) {
				result.customItems = customItems.map(function(item) {
					let api = (apiCustomItems.find(function(i) {
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
	let values = ["allProfiles", "aProfiles", "mProfiles"];

	let value = fields.reduce(function(acc, field) {
		let fieldIndex = values.indexOf(field);

		return fieldIndex > acc ? fieldIndex : acc;
	}, -1);

	return value >= 0 ? values[value] : "invisible";
}

function getVersionLabel(api) {
	return "v" + _.get(api, "fields.version", 0);
}

module.exports = {
	fetchApiS: fetchApiS,
	getVersionLabel: getVersionLabel,
};
