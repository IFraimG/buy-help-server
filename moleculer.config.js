
module.exports = {
	// nodeID: (process.env.NODEID ? process.env.NODEID + "-" : "") + os.hostname().toLowerCase(),
	repl: {
		enabled: true
	},

	logger: {
		type: "Console",
        options: {
            formatter: "full"
        }
	},

	errorHandler(err, info) {
		this.logger.warn("Log the error:", err);
		throw err; // Throw further
	}
};