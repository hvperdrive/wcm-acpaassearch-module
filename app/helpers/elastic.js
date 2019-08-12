require("rootpath")();

const elasticsearch = require("elasticsearch");
const mappings = require("../config/mappings");
const variablesHelper = require("../helpers/variables");
const indicesHelper = require("./indices");

const initiateClient = function initiateClient() {
	const me = this;

	variablesHelper.reload()
		.then(function(variables) {
			let host = "";
			let log = "";

			if (!variables || !variables.acpaassearch.variables.host) {
				me.connected = false;
				return;
			}

			host = variables.acpaassearch.variables.host + ":" + (variables.acpaassearch.variables.port || 9200);

			me.index = variables.acpaassearch.variables.index || "custom-index_" + Date.now();
			me.client = new elasticsearch.Client({
				host: host,
				log: log,
			});

			// Check if connection can be made
			me.client.ping(function(err) {
				if (err) {
					console.log("Unable to initiate elastic client"); // eslint-disable-line no-console
					console.log(err); // eslint-disable-line no-console
					me.connected = false;
					return;
				}

				me.connected = true;

				indicesHelper.createOrUpdate(me.client, {
					index: me.index,
					mappings: mappings,
				});
			});
		});
};

function ElasticClient() {
	this.client = null;
	this.connected = false;
	this.index = null;

	initiateClient.call(this);
}

ElasticClient.prototype.reload = function() {
	initiateClient.call(this);
};

module.exports = new ElasticClient();
