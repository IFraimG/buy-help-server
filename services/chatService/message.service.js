const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const Message = require("./Message");
require("dotenv").config();

module.exports = {
    name: "message",
    mixins: [DbService],
    adapter: new MongooseAdapter(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }),
    model: Message,
    actions: {
        getMessages: {
            params: {
                chatID: { type: "string" }
            },
            async handler(ctx) {
                let result = await this.adapter.model.find({ chatID: ctx.params.chatID }).exec()
                if (result != null) {
                    const res = result.sort((a, b) => new Date(a.dateCreated) - new Date(b.dateCreated))
                    return res
                }

                return null
            }
        },
        create: {
            params: {
                body: "string",
                chatID: "string",
                authorID: "string"
            },
            async handler(ctx) {
                let result = await this.adapter.model.create({ body: ctx.params.body, chatID: ctx.params.chatID, authorID: ctx.params.authorID })
                return result
            }
        },
    }
}