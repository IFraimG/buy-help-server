require("dotenv").config();

const DbService = require("moleculer-db");

module.exports = function (collection) {
	const MongoAdapter = require("moleculer-db-adapter-mongo");

	return {
		mixins: [DbService],
        adapter: new MongoAdapter(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }),
		collection
	};
}