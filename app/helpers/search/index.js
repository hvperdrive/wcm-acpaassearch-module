var _ = require("lodash");
var productSearchHelper = require("./product");

module.exports.getQuery = function getQuery(query, type) {

    return {
        highlight: {
            order : "score",
            fields: Object.assign({}, productSearchHelper.getHighlightFields())
        },
        query: {
            bool: {
                should: [].concat(
                    productSearchHelper.getQuery(query, type)
                )
            }
        }
    };
}
