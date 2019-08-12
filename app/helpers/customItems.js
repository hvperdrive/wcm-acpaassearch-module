const _ = require("lodash");
const path = require("path");

const ContentModel = require(path.join(process.cwd(), "app/models/content"));
const contentTypes = require("./contentTypes");
const languageHelper = require("./language");

const contentMongoQuery = function() {
	return {
		"meta.contentType": contentTypes().basic_page,
		"meta.published": true,
		"meta.deleted": false,
		"fields.body": {
			$exists: true,
		},
	};
};

const contentMongoFields = {
	_id: 0,
	uuid: 1,
	fields: 1,
	"meta.contentType": 1,
	"meta.slug": 1,
};

function fetchCustomItems(uuids) {
	return ContentModel.find(_.assign(contentMongoQuery(), {
		uuid: {
			$in: uuids,
		},
	}), contentMongoFields)
	.lean()
	.exec()
	.then(function(items) {
		return items.map(function(item) {
			item.fields.body = languageHelper.verifyMultilanguage(item.fields.body);
			return item;
		});
	}, function(err) {
		throw err;
	});
}

module.exports = {
	fetchCustomItems: fetchCustomItems,
};
