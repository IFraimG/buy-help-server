const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const Needy = require("./Needy");
require("dotenv").config();
const bcrypt = require("bcrypt")


module.exports = {
    name: "needy",
    mixins: [DbService],
    adapter: new MongooseAdapter(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }),
    model: Needy,
    actions: {
        setMarket: {
            rest: "PUT /set_market",
            async handler(ctx) {
                try {
                    let result = await this.adapter.model.findByIdAndUpdate(ctx.params.userID, { market: ctx.params.market }).exec()
                    return result
                  } catch (error) {
                    ctx.meta.$statusCode = 404
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
                    let needy = await this.adapter.model.findById(ctx.params.authorID).exec()
                    if (needy == null) {
                        ctx.meta.$statusCode = 404
                        return { message: "NotFound" }
                    }
                    
                    return { fcmToken: needy.fcmToken }
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
                    let needy = await this.adapter.model.findById(ctx.params.userID).exec()
                
                    const match = await bcrypt.compare(ctx.params.old_password, needy.password);
                    if (!match) {
                        ctx.meta.$statusCode = 400
                        return { message: "Incorrect Password" }
                    }
                
                    const isNeedyWithLogin = await this.adapter.model.findOne({ login: ctx.params.login, _id: { $ne: ctx.params.userID } }).exec()
                    if (isNeedyWithLogin != null) {
                        ctx.meta.$statusCode = 403
                        return { message: "Пользователь с таким логином уже существует" }
                    }

                    const isNeedyWithPhone = await this.adapter.model.findOne({ phone: ctx.params.phone, _id: { $ne: ctx.params.userID } }).exec()
                    if (isNeedyWithPhone != null) {
                        ctx.meta.$statusCode = 403
                        return { message: "Пользователь с таким телефоном уже существует" }
                    }

                    if (ctx.params?.login.length > 0) needy.login = ctx.params.login
                    if (ctx.params?.phone.length > 0) needy.phone = ctx.params.phone
                    if (ctx.params?.password.length > 0) {
                      const salt = await bcrypt.genSalt(10)
                      const password = await bcrypt.hash(ctx.params.password, salt);
                      needy.password = password
                    }

                    const result = await needy.save()
                    return result
                  } catch (error) {
                    console.log(error.message);
                    ctx.meta.$statusCode = 400
                    return {message: error.message}
                  
                  }
            }
        },
        changeToken: {
            rest: "PUT /change_token",
            params: {},
            async handler(ctx) {
                try {
                    let needy = await this.adapter.model.findByIdAndUpdate(ctx.params.userID, { fcmToken: ctx.params.token }).exec()
                    if (needy == null) {
                        ctx.meta.$statusCode = 404
                        return { message: "NotFound" }
                    }
                    
                    return needy
                  } catch (error) {
                    console.log(error.message);
                    return {message: error.message}
                  }
            }
        },
        getByMarket: {
            params: {
                market: { type: "string" }
            },
            async handler(ctx) {
                let result = await this.adapter.model.find({ market: ctx.params.market }).exec()
                return result
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
                    let user = await this.adapter.model.create({ password: ctx.params.password, login: ctx.params.login, phone: ctx.params.phone, fcmToken: ctx.params.tokenFCM })
                    return user
                } catch (err) {
                    ctx.meta.$statusCode = 400
                    return { message: err.message }
                }
            }
        },
        getLoginPhoneData: {
            params: {
                login: {type: "string"},
                phone: {type: "string"}
            },
            async handler(ctx) {
                const isNeedyWithPhone = await this.adapter.model.findOne({ phone: ctx.params.phone }).exec()
                const isNeedyWithLogin = await this.adapter.model.findOne({ login: ctx.params.login }).exec()
                const isNeedy = await this.adapter.model.findOne({ phone: ctx.params.phone, login: ctx.params.login }).exec()
                return { isLogin: isNeedyWithLogin != null, isPhone: isNeedyWithPhone != null, isUser: isNeedy != null, userForLogin: isNeedyWithPhone }
            }
        },
    },
    methods: {
        setMarket() {},
        getToken() {},
        editProfile() {},
        changeToken() {}
    }
}