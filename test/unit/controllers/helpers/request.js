const expect = require("chai").expect;
const mockery = require("mockery");

describe("Request helper", function() {
	before(function() {
		mockery.enable({
			warnOnUnregistered: false,
			useCleanCache: true,
		});
	});

	afterEach(function() {
		mockery.deregisterAll();
		mockery.resetCache();
	});

	it("Index item in Solr with success response", function(done) {
		mockery.registerMock("request", module.exports = function(options, callback) {
			const err = null;
			const data = {
				statusCode: 200,
			};
			const body = {
				success: true,
			};

			callback(err, data, body);
		});
		mockery.registerMock("./error", module.exports = function() { });
		const RequestHelper = require("app/controllers/helpers/request");
		const data = {
			variables: {
				searchApiDomain: "APIdomain",
				currentDomain: "domain/",
				consumerKey: "key",
				consumerSecret: "secret",
			},
		};

		RequestHelper(data)
			.then(function onSuccess(response) {
				expect(response).to.have.property("request");
				expect(response.request).to.be.true;
				done();
			}, function onError(responseError) {
				expect(responseError).to.be.undefined;
				done();
			});
	});

	it("Index item in Solr with error response", function(done) {
		mockery.registerMock("request", module.exports = function(options, callback) {
			const err = null;
			const data = {
				statusCode: 200,
			};
			const body = {
				success: false,
			};

			callback(err, data, body);
		});
		mockery.registerMock("./error", module.exports = function() { });
		const RequestHelper = require("app/controllers/helpers/request");
		const data = {
			variables: {
				searchApiDomain: "APIdomain",
				currentDomain: "domain/",
				consumerKey: "key",
				consumerSecret: "secret",
			},
		};

		RequestHelper(data)
			.then(function onSuccess(response) {
				expect(response).to.have.property("request");
				expect(response.request).to.be.false;
				done();
			}, function onError(responseError) {
				expect(responseError).to.be.undefined;
				done();
			});
	});
});
