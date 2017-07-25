var VariableHelper = require("app/helpers/modules/lib").Variables;
var packageConfig = require("../../package.json");

var variables = null;

var init = function init() {
	VariableHelper.getAll(packageConfig.name, packageConfig.version)
		.then(function onSuccess(response) {
			variables = response;
		})
		.catch(function onError(responseError) {
			console.error("Failed getting variables (eventhandler module)");
			console.error(responseError);
		});
};

init();

module.exports = function getVariables() {
	return variables;
};

module.exports.reload = init;

