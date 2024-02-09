const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const Giver = require("./Giver");
require("dotenv").config();
const bcrypt = require("bcrypt")
const generateRandomString = require("../../utils/generateRandomString")

module.exports = {
    name: "giver",
    mixins: [DbService],
    adapter: new MongooseAdapter(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }),
    model: Giver,
    actions: {
        setMarket: {
            rest: "PUT /set_market",
            params: {
                userID: { type: "string" },
                market: { type: "string" },
            },
            async handler(ctx) {
                try {
                    let result = await this.adapter.model.findByIdAndUpdate(ctx.params.userID, { market: ctx.params.market })
                    return result
                  } catch (error) {
                    ctx.meta.$statusCode = 400
                    return {message: error.message}
                  }
            }
        },
        getToken: {
            rest: "GET /get_token/:authorID",
            params: {
                authorID: { type: "string" }
            },
            async handler(ctx) {
                try {
                    let giver = await this.adapter.model.findById(ctx.params.authorID).exec()
                    if (giver == null) {
                        ctx.meta.$statusCode = 404
                        return { message: "NotFound" }
                    }
                    
                    return { fcmToken: giver.fcmToken }
                } catch (error) {
                    console.log(error.message);
                    return {message: error.message}
                }
            }
        },
        editProfile: {
            rest: "PUT /edit_profile",
            params: {
                
            },
            async handler(ctx) {
                try {
                    let giver = await this.adapter.model.findById(ctx.params.userID).exec()
                
                    const match = await bcrypt.compare(ctx.params.old_password, giver.password);
                    if (!match) {
                        ctx.meta.$statusCode = 400
                        return { message: "Incorrect Password" }
                    }
                
                    const isGiverWithLogin = await this.adapter.model.findOne({ login: ctx.params.login, _id: { $ne: ctx.params.userID } }).exec()
                    if (isGiverWithLogin != null) {
                        ctx.meta.$statusCode = 403
                        return { message: "Пользователь с таким логином уже существует" }
                    }

                    const isGiverWithPhone = await this.adapter.model.findOne({ phone: ctx.params.phone, _id: { $ne: ctx.params.userID } }).exec()
                    if (isGiverWithPhone != null) {
                        ctx.meta.$statusCode = 403
                        return { message: "Пользователь с таким телефоном уже существует" }
                    }

                    if (ctx.params?.login.length > 0) giver.login = ctx.params.login
                    if (ctx.params?.phone.length > 0) giver.phone = ctx.params.phone
                    if (ctx.params?.password.length > 0) {
                      const salt = await bcrypt.genSalt(10)
                      const password = await bcrypt.hash(ctx.params.password, salt);
                      giver.password = password
                    }

                    const result = await giver.save()
                    return result
                  } catch (error) {
                    console.log(error.message);
                    ctx.meta.$statusCode = 400
                    return {message: error.message}
                  
                  }
            }
        },
        findById: {
            params: {
                id: {type: "string"}
            },
            async handler(ctx) {
                let result = await this.adapter.model.findById(ctx.params.id).exec()
                return result
            }
        },
        changeToken: {
            rest: "PUT /change_token",
            async handler(ctx) {
                try {
                    let giver = await this.adapter.model.findByIdAndUpdate(ctx.params.userID, { fcmToken: ctx.params.token }).exec()
                    if (giver == null) {
                        ctx.meta.$statusCode = 404
                        return { message: "NotFound" }
                    }
                    
                    return giver
                  } catch (error) {
                    console.log(error.message);
                    return {message: error.message}
                  }
            }
        },
        getLoginPhoneData: {
            async handler(ctx) {
                let isGiverWithLogin = null
                let isGiverWithPhone = null
                let isUser = null

                if (ctx.params?.login != null) isGiverWithLogin = await this.adapter.model.findOne({ login: ctx.params.login }).exec()
                if (ctx.params?.phone != null) isGiverWithPhone = await this.adapter.model.findOne({ phone: ctx.params.phone }).exec()
                if (ctx.params?.phone != null && ctx.params?.login != null) isUser = await this.adapter.model.findOne({ login: ctx.params.login, phone: ctx.params.phone }).exec()
                
                return { isLogin: isGiverWithLogin != null, isPhone: isGiverWithPhone != null, isUser: isUser != null, userForLogin: isGiverWithLogin }
            }
        },
        create: {
            params: {
                password: {type: "string"},
                login: {type: "string"},
                phone: {type: "string"},
                tokenFCM: {type: "string"}
            },
            async handler(ctx) {
                try {
                    let user = await this.adapter.model.create({ password: ctx.params.password, login: ctx.params.login, phone: ctx.params.phone, fcmToken: ctx.params.tokenFCM, authID: generateRandomString(10) })
                    return user
                } catch (err) {
                    ctx.meta.$statusCode = 400
                    return { message: err.message }
                }
            }
        },
        getPinMarket: {
            rest: "GET /get_pin_market",
            params: {
                userID: { type: "string" }
            },
            async handler(ctx) {
                try {
                    let giver = await this.adapter.model.findById(ctx.params.userID)
                    if (giver?.market == null) {
                        ctx.meta.$statusCode = 404
                        return { message: "Error" }
                    }
                    return { market: giver.market }
                  } catch (error) {
                    ctx.meta.$statusCode = 404
                    console.log(error.message);
                    return { message: error.message }
                  }
            }
        }
    },
    methods: {
        setMarket() {},
        getToken() {},
        editProfile() {},
        changeToken() {}
    }
}