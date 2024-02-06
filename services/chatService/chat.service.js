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
                if (chat != null) return chat
                    
                let user = await this.broker.call("needy.findByID", {id: data[1]})
                let title = "Новый чат"
                if (user != null) title = user.login

                chat = this.adapter.model.create({ title: title, users: data })
                return chat
            }
        }
    }
}