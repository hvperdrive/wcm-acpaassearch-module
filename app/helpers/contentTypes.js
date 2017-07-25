"use strict";

var contentTypes = {
	product: "5937cddde77a130b15f572d2", // @todo: remove dummy
	version: "593eb706aef3a98476c03ba6", // @todo: remove dummy
	api: "593eb572aef3a98476c03ba1", // @todo: remove dummy
};

module.exports = function() {
	return contentTypes;
};

module.exports.reload = function(uuids) {
	// @todo: fetch contentTypes & store mongo id
};
