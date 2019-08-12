const Q = require("q");
const _ = require("lodash");

const readIndex = function readIndex(client, index) {
	return client.indices.get({
		index: index,
	});
};

const createIndex = function createIndex(client, index) {
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

const removeIndex = function removeIndex(client, index) {
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

const createOrUpdate = function createOrUpdate(client, index) {
	return readIndex(client, index.index)
		.then(function(storedIndex) {
			if (!indexesAreEqual(index, storedIndex)) {
				return removeIndex(client, index.index)
					.then(function() {
						return createIndex(client, index);
					});
			}
		}, function(errResponse) {
			if (errResponse.status === 404) {
				return createIndex(client, index);
			}

			throw errResponse;
		});
};

const indexesAreEqual = function indexesAreEqual(index, storedIndex) {
	const equalMappings = _.isEqual(index.mappings, storedIndex.mappings);
	const equalSettings = !index.settings || _.isEqual(index.settings, storedIndex.settings);

	return !(equalMappings && equalSettings);
};

module.exports = {
	read: readIndex,
	create: createIndex,
	remove: removeIndex,
	createOrUpdate: createOrUpdate,
};
