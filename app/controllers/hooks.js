var variablesHelper = require("../helpers/variables");
var elastic = require("../helpers/elastic");

var onConfigurationChanged = function onConfigurationChanged() {
	console.log("on configuration changed");
	// Reload config
	variablesHelper.reload()
		.then(function() {
			// @todo: load content types
		});

	elastic.reload();

};

var beforeRemove = function beforeRemove() {
	console.log("before remove");
};

var onDisabled = function onDisabled() {
	console.log("on disabled");
};

var beforeDisable = function beforeDisable() {
	console.log("before disable");
};

var onRemoved = function() {
	console.log("on removed");
};

module.exports = function handleHooks(hooks) {
	var myHooks = {
		onConfigurationChanged: onConfigurationChanged,
		beforeRemove: beforeRemove,
		onRemoved: onRemoved,
		onDisabled: onDisabled,
		beforeDisable: beforeDisable,
	};

	Object.assign(hooks, myHooks);
};
