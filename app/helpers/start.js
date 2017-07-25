"use strict";

require("rootpath")();
var ElasticHelper = require("app/helpers/elastic");
var index = require("../config/mappings");

module.exports = function() {
	ElasticHelper.indices.create(index);


};
