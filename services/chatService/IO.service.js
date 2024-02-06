const SocketIOService = require("moleculer-io")
let IO = require("socket.io");
const ApiGatewayService = require("moleculer-web");
const SocketIO = require("moleculer-socketio");

module.exports = {
    name: "io",
    mixins: [SocketIOService],
    settings: {
        port: 8080
    },
    // events: {
    //     "**"(payload, sender, event) {
	// 		if (this.io) this.io.emit("event", {sender, event, payload})
	// 	}
    // },
    namespaces: {
        "/": {
            async created() {
                this.io.on("connection", socket => {
                    console.log("connected!");
                    // socket.on("create_chat", async data => {
                        // let chat = await this.broker.call("chat.create", { data })
                        // socket.emit("getCreatedChat", chat)
                    // })
                });
            },
            events: {
                "create_chat": async (data, ask) => {
                    let chat = await this.$service.broker.call("chat.create", { data })
                    console.log(chat);
                    this.emit("getCreatedChat", chat)
                },
                "send_user_id_to_get_chat": async (data) => {

                }
            }
        },
    },
    // onCreated(io) {
    //     this.io = io
        // this.io = IO.listen(this.server)
        // this.io.on("connection", socket => {
            // console.log("connected!");

            // socket.on("send_user_id_to_get_chat", async (data) => {
            //     const result = await Chat.find({ users: { $elemMatch: { $regex: data.userID, $options: 'i' } } }).exec()
            //     if (result != null) {
            //         let chats = [...result]
            //         for (let index = 0; index < chats.length; index++) {
            //             if (data.type == "giver") {
            //                 const user = await Needy.findById(chats[index].users[1]).exec()
            //                 chats[index].title = user.login
            //             } else if (data.type == "needy") {
            //                 const user = await Giver.findById(chats[index].users[0]).exec()
            //                 chats[index].title = user.login
            //             }
            //         }
            //         chats = chats.sort((a, b) => new Date(a.dateCreated) - new Date(b.dateCreated))
            //         this.io.emit("get_chats", {result: chats})
            //     }
            // })
        
            // socket.on("get_messages", data => {
            //     Message.find({ chatID: data }).then(result => {
            //         if (result != null) {
            //             const res = result.sort((a, b) => new Date(a.dateCreated) - new Date(b.dateCreated))
            //             this.io.emit("set_messages", { result: res })
            //         }
            //     })
            // })
        
            // socket.on("save_message", data => {
            //     Message.create({ body: data.body, chatID: data.chatID, authorID: data.authorID }).then(result => {
            //         if (result != null) this.io.emit("set_messages", { result: [result] })
            //     })
            // })
        // })
    // }
}