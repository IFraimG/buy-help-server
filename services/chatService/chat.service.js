const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const Chat = require("./Chat");
require("dotenv").config();

module.exports = {
    name: "chat",
    mixins: [DbService],
    adapter: new MongooseAdapter(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }),
    model: Chat,
    actions: {
        create: {
            params: {
                data: { type: "array" }
            },
            async handler(ctx) {
                let chat = await this.adapter.model.findOne({ users: ctx.params.data }).exec()
                this.logger.info(chat);
                if (chat != null) return chat
                    
                let user = await this.broker.call("needy.findById", {id: ctx.params.data[1]})
                let title = "Новый чат"
                if (user != null) title = user.login

                chat = this.adapter.model.create({ title: title, users: ctx.params.data })
                return chat
            }
        },
        findChatByUserID: {
            params: {
                userID: { type: "string" }
            },
            async handler(ctx) {
                let result = await Chat.find({ users: { $elemMatch: { $regex: ctx.params.userID, $options: 'i' } } }).exec()
                return result
            }
        }
    }
}