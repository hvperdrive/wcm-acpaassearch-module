var customItems = require("./customItems");
var product = require("./product");
var version = require("./version");

module.exports = {
    index: "local_content",
    mappings: {
        product: product,
        version: version
    }
};
