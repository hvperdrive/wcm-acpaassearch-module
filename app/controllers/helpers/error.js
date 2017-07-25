require("rootpath")();
var _ = require("lodash");
var uuid = require("node-uuid");
var ErrorModel = require("app/models/errorLog");

module.exports = function(body, code, options) {
	if (_.get(body, "msgs[0]")) {
		body = body.msgs[0];
	}
	return ErrorModel
		.create({
			type: "module-acpaassearch",
			title: "Indexing item in elastic",
			code: code,
			error: body,
			requestData: options,
			identifier: uuid.v1(),
		});
};
