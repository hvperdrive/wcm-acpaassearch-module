var Emitter = require("app/middleware/emitter");

module.exports.start = function start() {
	Emitter.on("contentCreated", function(contentItem) {
		// index new
	});

	Emitter.on("contentUpdated", function(contentItem) {
		// index updated
	});

	Emitter.on("contentRemoved", function(contentItem) {
		// remove index
	});
};
