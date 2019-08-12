const variablesHelper = require("../helpers/variables");
const contentTypesHelper = require("../helpers/contentTypes");
const elastic = require("../helpers/elastic");
const listeners = require("../controllers/listeners");

const onConfigurationChanged = function onConfigurationChanged() {
	// Reload config
	variablesHelper.reload()
		.then(function() {
			elastic.reload();
			contentTypesHelper.reload();
		});

};

const beforeRemove = function beforeRemove() {
	// Stop listeners
	listeners.stop();
};

const beforeDisable = function beforeDisable() {
	// Stop listeners
	listeners.stop();
};

const onEnabled = function onEnabled() {
	// Reenable listeners
	listeners.start();
};

const onLoadComplete = function onLoadComplete() {
	// Setup listeners
	listeners.start();

	onConfigurationChanged();
};

module.exports = function handleHooks(hooks) {
	const myHooks = {
		onConfigurationChanged: onConfigurationChanged,
		beforeRemove: beforeRemove,
		onLoadComplete: onLoadComplete,
		beforeDisable: beforeDisable,
		onEnabled: onEnabled,
	};

	Object.assign(hooks, myHooks);
};
