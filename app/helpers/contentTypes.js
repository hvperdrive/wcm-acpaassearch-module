const path = require("path");

const ContentTypeModel = require(path.join(process.cwd(), "app/models/contentType"));

const safeLabels = [
	"product",
	"product_doc_version",
	"api",
	"basic_page",
	"timeline_item",
	"main_documentation",
	"news_item",
	"showcase_item"
];
let contentTypes = {};

const toList = (types) => {
	return Object.keys(types).reduce((acc, curr) => {
		acc.push({
			type: curr,
			_id: types[curr],
		});

		return acc;
	}, []);
};

function reload() {
	ContentTypeModel
		.find({
			"meta.deleted": false,
			"meta.safeLabel": {
				$in: safeLabels,
			},
		})
		.lean()
		.exec()
		.then((types) => {
			contentTypes = types.reduce((acc, type) => {
				acc[type.meta.safeLabel] = type._id.toString();
				return acc;
			}, {});
		});
}

function verifyType(type) {
	type = typeof type === "string" ? type : type._id;

	return toList(contentTypes).find((t) => {
		return t._id === type.toString();
	});
}

module.exports = function getContentTypes() {
	return contentTypes;
};

module.exports.reload = reload;
module.exports.verifyType = verifyType;
module.exports.indexableTypes = [
	// product is indexed separately due to all the population needs
	"main_documentation",
	"news_item",
	"showcase_item"
];
