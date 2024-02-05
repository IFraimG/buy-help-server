const gatewayAPIService = require("../gatewayAPI/gatewayAPI.service");
require("dotenv").config();
const bcrypt = require("bcrypt")
let { jwtsecret } = require("../../configs/jwt")
const jwt = require('jsonwebtoken');

module.exports = {
    name: "auth",
    mixins: [gatewayAPIService],
    actions: {
        giverSignup: {
            rest: "POST /giver/signup",
            params: {
                login: { type: "string" },
                phone: { type: "string" },
                tokenFCM: { type: "string" },
                password: { type: "string" }
            },
            async handler(ctx) {
                let result = await this.signup(ctx.params, "giver")
                if (result.error != null) {
                    ctx.meta.$statusCode = result.error.statusCode
                    return result.error
                }
                return result
            }
        },
        needySignup: {
            rest: "POST /needy/signup",
            params: {
                login: { type: "string" },
                phone: { type: "string" },
                tokenFCM: { type: "string" },
                password: { type: "string" }
            },
            async handler(ctx) {
                let result = await this.signup(ctx.params, "needy")
                if (result.error != null) {
                    ctx.meta.$statusCode = result.error.statusCode
                    return result.error
                }
                return result
            }
        },
        giverLogin: {
            rest: "POST /giver/login",
            params: {
                login: { type: "string" },
                password: { type: "string" }
            },
            async handler(ctx) {
                let result = await this.login(ctx.params, "giver")
                if (result.error == null) return result

                ctx.meta.$statusCode = result.error.statusCode
                return result.error
            }
        },
        needyLogin: {
            rest: "POST /needy/login",
            params: {
                login: { type: "string" },
                phone: { type: "string" },
                password: { type: "string" }
            },
            async handler(ctx) {
                let result = await this.login(ctx.params, "needy")
                if (result.error == null) return result

                ctx.meta.$statusCode = result.error.statusCode
                return result.error
            }
        },
    },
    methods: {
        async signup(params, typeUser) {
            let { isPhone, isLogin, isUser } = this.broker.call(`${typeUser}.getLoginPhoneData`, { phone: params.phone, login: params.login })
            if (isLogin != null || isUser) {
                return {error: { statusCode: 403, message: "Пользователь с таким логином уже существует" }}
            }
            if (isPhone != null) {
                return {error: { statusCode: 403, message: "Пользователь с таким телефоном уже существует" }}
            }

            const salt = await bcrypt.genSalt(10)
            const password = await bcrypt.hash(params.password, salt);
            let user = await this.broker.call(`${typeUser}.create`, { password, login: params.login, phone: params.phone, tokenFCM: params.tokenFCM })
            let token = jwt.sign({
                sub: typeUser == "needy" ? user._id : user.authID,
                phone: user.phone,
                login: user.login,
                id: user._id,
                type: typeUser,
              }, jwtsecret)
              console.log(user);
            return {token: "Bearer " + token, user: { login: user.login, phone: user.phone, id: user._id }, error: null}
        },
        async login(params, typeUser) {
            let user = await this.broker.call(`${typeUser}.getLoginPhoneData`, { login: params.login, phone: "" })
            if (!user) return {error: { statusCode: 404 }, token: ""}
            
            const match = await bcrypt.compare(params.password, user.password);
            if (!match) return {error: { statusCode: 400 }, token: ""}
            else {
                let token = jwt.sign({
                  sub: typeUser == "needy" ? user._id : user.authID,
                  phone: user.phone,
                  login: user.login,
                  id: user._id,
                  type: typeUser,
                }, jwtsecret)

                return {token: "Bearer " + token, user: { login: user.login, phone: user.phone, id: user._id }, error: null}
            }
        }
    }
}