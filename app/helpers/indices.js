require("rootpath")();
var indexHelper = require("app/helpers/elastic/indices");

var createIndex = function createIndex(client, index) {
	indexHelper.read(index, client)
		.then(function() {
			indexHelper.remove(index, client)
				.then(function() {
					indexHelper.create(index, client);
				});
		}, function(errResponse) {
			if (errResponse.status === 404) {
				indexHelper.create(index, client);
			}
		});
};

module.exports = {
	create: createIndex,
};
