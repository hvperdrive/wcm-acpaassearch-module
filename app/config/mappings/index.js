var product = require("./product");
var version = require("./version");

module.exports = {
	index: "acpaas_content",
	mappings: {
		product: product,
		version: version,
	},
};
