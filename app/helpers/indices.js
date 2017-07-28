require("rootpath")();

var Q = require("q");

var readIndex = function readIndex(client, index) {
	return client.indices.getAlias({
		index: index,
	});
};

var createIndex = function createIndex(client, index) {
	// create new schema
	return readIndex(client, index.index)
		.then(function onSuccess() {
			return Q.reject("Schema \"" + index.index + "\" already exists!");
		}, function onError(responseError) {
			// Check if mapping does not exists
			if (responseError.status === 404) {
				// Create new mapping
				return client.indices.create({
					index: index.index,
					body: {
						mappings: index.mappings,
						settings: index.settings,
					},
				});
			}

			throw responseError;
		});
};

var removeIndex = function removeIndex(client, index) {
	return readIndex(client, index)
		.then(function onSuccess() {
			return client.indices.delete({
				index: index,
			});
		}, function onError(responseError) {
			if (responseError.status === 404) {
				return Q.reject("Schema \"" + index.index + "\" does not exist!");
			}
		});
};

var createOrUpdate = function createOrUpdate(client, index) {
	return readIndex(client, index.index)
		.then(function() {
			return removeIndex(client, index.index)
				.then(function() {
					return createIndex(client, index);
				});
		}, function(errResponse) {
			if (errResponse.status === 404) {
				return createIndex(client, index);
			}

			throw errResponse;
		});
};

module.exports = {
	read: readIndex,
	create: createIndex,
	remove: removeIndex,
	createOrUpdate: createOrUpdate,
};
