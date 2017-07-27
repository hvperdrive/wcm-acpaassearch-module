var config = require("../config/language");

module.exports.verifyMultilanguage = function(value) {
	return typeof value === "string" ? value : value[config.lang]
};

module.exports.currentLanguage = function() {
	return config.lang;
};
