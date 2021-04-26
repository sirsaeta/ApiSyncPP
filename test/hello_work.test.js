const request = require("supertest");

const app = require("../src/app");

describe('GET /', function() {
	it('responds with text', function(done) {
		request(app)
			.get('/')
			.set('Accept', 'application/json')
			.expect('Content-Type', /text/)
			.expect(200)
			.expect("Hello World!")
			.end((err) => {
				if (err) {
					return done(err);
				}
				done();
			});
	});
});