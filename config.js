exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/band-mom-db';

exports.TEST_DATABASE_URL = (
	process.env.TEST_DATABASE_URL ||
	'mongodb://localhost/test-band-mom-db');

exports.PORT = process.env.PORT || 8080;