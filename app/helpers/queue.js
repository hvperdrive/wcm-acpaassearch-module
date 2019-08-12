const Q = require("q");

module.exports.runQueue = function runQueue(queue) {
	let result = Q.resolve();

	queue.forEach((update, i) => {
		result = result.then(() => update(i));
	});

	return result;
};
