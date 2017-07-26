"use strict";

require("rootpath")();
var elasticsearch = require("elasticsearch");
var index = require("../config/mappings");
var variablesHelper = require("../helpers/variables");
var indicesHelper = require("./indices");

var initiateClient = function initiateClient() {
	var me = this;

	variablesHelper.reload()
		.then(function(variables) {

			var host = "";
			var log = "";

			if (!variables || !variables.acpaassearch.variables.host) {
				me.connected = false;
				return;
			}

			host = variables.acpaassearch.variables.host;

			me.client = new elasticsearch.Client({
				host: host,
				log: log,
			});

			// Check if connection can be made
			me.client.ping(function(err) {
				if (err) {
					console.log("Unable to initiate elastic client");
					console.log(err);
					me.connected = false;
					return;
				}

				me.connected = true;

                indicesHelper.create(me.client, index);
			});
		});
};

function ElasticClient() {
	this.client = null;
	this.connected = false;

	initiateClient.call(this);
}

ElasticClient.prototype.reload = function() {
	initiateClient.call(this);
};

module.exports = new ElasticClient();
