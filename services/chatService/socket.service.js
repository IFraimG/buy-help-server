const SocketIO = require("moleculer-socketio");

module.exports = {
	name: "socket-service",

	mixins: [ SocketIO ],

	settings: {
		port: 8080,
        options: {},
	},

    namespaces: {
        "/": {
            connection(ctx) {
                this.logger.info("Someone is connected");
                ctx.socket.emit("hello", "Welcome to socket.io");
            },
            create_chat: {
                async handler (ctx) {
                    let chat = await this.broker.call("chat.create", { data: ctx.params })

                    this.logger.info(chat)

                    ctx.socket.emit("getCreatedChat", chat)
                }
            },
            send_user_id_to_get_chat: {
                params: {
                    userID: "string",
                    type: "string"
                },
                async handler(ctx) {
                    const result = await this.broker.call("chat.findChatByUserID", {userID: ctx.params.userID})
                    if (result != null) {
                        let chats = [...result]
                        for (let index = 0; index < chats.length; index++) {
                            if (ctx.params.type == "giver") {
                                const user = await this.broker.call("needy.findById", {id: chats[index].users[1]})
                                chats[index].title = user.login
                            } else if (ctx.params.type == "needy") {
                                const user = await this.broker.call("giver.findById", {id: chats[index].users[0]})
                                chats[index].title = user.login
                            }
                        }
                        chats = chats.sort((a, b) => new Date(a.dateCreated) - new Date(b.dateCreated))
                        ctx.socket.emit("get_chats", {result: chats})
                    }
                }
            },
            get_messages: {
                async handler(ctx) {
                    let result = await this.broker.call("message.getMessages", { chatID: ctx.params })
                    ctx.socket.emit("set_messages", { result })
                }
            },
            save_message: {
                params: {
                    body: "string",
                    chatID: "string",
                    authorID: "string"
                },
                async handler(ctx) {
                    let result = await this.broker.call("message.create", { body: ctx.params.body, chatID: ctx.params.chatID, authorID: ctx.params.authorID })
                    if (result != null) ctx.socket.emit("set_messages", { result: [result] })
                    else ctx.socket.emit("set_messages", { result: [] })
                }
            }
        }
    }
}