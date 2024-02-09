const ApiService = require("moleculer-web")
let { jwtsecret } = require("../../configs/jwt")
const jwt = require('jsonwebtoken');
const ApiGateway = require("moleculer-web");
const { UnAuthorizedError } = ApiGateway.Errors;

module.exports = {
    mixins: [ApiService],
	settings: {
		routes: [
            {
				path: "/auth",
				authorization: false,
				authentication: false,
				aliases: {
					"POST /giver/signup": "auth.giverSignup",
					"POST /needy/signup": "auth.needySignup",
					"POST /giver/login": "auth.giverLogin",
					"POST /needy/login": "auth.needyLogin",
				},
                bodyParsers: {
                    json: true,
                    urlencoded: { extended: true }
                },
			},
            {
                whitelist: [
                    "notifications.*",
                    "needy.*",
                    "giver.*",
                    "advertisements.*",
                    "auth.testGiver",
                    "auth.testNeedy"
                ],
                autoAliases: true,
                bodyParsers: {
                    json: true,
                    urlencoded: { extended: true }
                },
                authentication: true,
                authorization: true
                // mergeParams: false
            },
        ],
        cors: {
            origin: "*",
            methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
        }
	},
    methods: {
        authenticate(ctx, route, req, res) {
            const token = req.headers.authorization;
        
            if (token && token.startsWith('Bearer ')) {
                try {
                    const decoded = jwt.verify(token.slice(7), jwtsecret)
                    ctx.meta.user = decoded
                } catch (error) {
                    throw new UnAuthorizedError()
                }
            } else throw new UnAuthorizedError()
        }
    }
}