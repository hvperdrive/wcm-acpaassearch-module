const productHelper = require("./product");
const docHelper = require("./doc");
const indexableTypes = require("./contentTypes").indexableTypes;
const runQueue = require("./queue").runQueue;

module.exports = () => {
	const elasticsearch = require("./elastic");

	return productHelper
		.fetchProducts()
		.then((products) => {
			let items = products;

			return runQueue(indexableTypes.map((type) => {
				return () => docHelper.fetchDocs(type)
					.then((docs) => items = items.concat(docs));
			}));
		})
		.then((products) => {
			return productHelper.syncProducts(products, elasticsearch);
		});
};
