"use strict";

require("rootpath")();
var elasticsearch = require("elasticsearch");

var variablesHelper = require("../helpers/variables");

var variables = variablesHelper();
var host = "";
var log = "";

if (variables && variables.acpaassearch.variables.host) {
	host = variables.acpaassearch.variables.host;
}

var client = new elasticsearch.Client({
	host: host,
	log: log,
});

// Load initial Elastic setup
client.ping(function(err) {
	if (err) {
		console.log("Unable to initiate elastic client");
	}
});
module.exports = client;
