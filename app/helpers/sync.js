"use strict";

require("rootpath")();
var _ = require("lodash");
var Q = require("q");

var elasticsearch = require("./elastic");

module.exports.product = function(product) {
	return Q.resolve();
};

module.exports.version = function(version) {
	return Q.resolve();
};
