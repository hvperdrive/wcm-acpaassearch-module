"use strict";

var contentTypes = {
	product: "5937cddde77a130b15f572d2", // @todo: remove dummy
	version: "593eb706aef3a98476c03ba6", // @todo: remove dummy
	api: "593eb572aef3a98476c03ba1", // @todo: remove dummy
};

var toList = function(types) {
	return Object.keys(types).reduce(function(acc, curr) {
		acc.push({
			type: curr,
			id: types[curr],
		});

		return acc;
	}, []);
};

module.exports = contentTypes;

module.exports.reload = function(uuids) {
	// @todo: fetch contentTypes & store mongo id
};

module.exports.verifyType = function(type) {
	type = typeof type === "string" ? type : type._id;

	return toList(contentTypes).find(function(t) {
		return t.id === type.toString();
	});
}
