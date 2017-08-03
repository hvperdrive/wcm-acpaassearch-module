var getModuleMethod = require("app/helpers/modules/lib").getModuleMethod;

module.exports.prepareMember = function prepareMember(req, res, next) {
	var memberAccess = getModuleMethod("members", "MemberAccessMiddleware");

	if (memberAccess && typeof memberAccess.hard === "function") {
		return memberAccess.soft(req, res, next);
	}

	return next();
};
