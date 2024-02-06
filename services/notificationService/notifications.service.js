const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const Notification = require("./Notification");
require("dotenv").config();

module.exports = {
    name: "notifications",
    mixins: [DbService],
    adapter: new MongooseAdapter(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }),
    model: Notification,
    actions: {
        getNotifications: {
            rest: "GET /get_notifications",
            params: {
                userID: { type: "string" },
                typeOfUser: { type: "string" }
            },
            async handler(ctx) {
                try {
                    const notifications = await this.adapter.model.find({ userID: ctx.params.userID, typeOfUser: ctx.params.typeOfUser }).exec()
                    if (notifications == null) {
                        ctx.meta.$statusCode = 404
                        return { message: "NotFound" }
                    }
                    return {result: notifications}
                  } catch (error) {
                    return {message: error.message}
                  }
            }
        },
        getNotificationOne: {
            rest: "GET /get_notification_one/:notificationID",
            params: {
                notificationID: { type: "string" }
            },
            async handler(ctx) {
                try {
                    const notification = await this.adapter.model.findById(ctx.params.notificationID).exec()
                    if (notification == null) {
                        ctx.meta.$statusCode = 404
                        return { message: "NotFound" }
                    }
                    return notification
                } catch (error) {
                    return {message: error.message}
                }
            }
        },
        createNotification: {
            rest: "POST /create_notification",
            params: {
                
            },
            async handler(ctx) {
                try {
                    const listItems = ctx.params.listItems == null ? [] : ctx.params.listItems
                    const buttonType = ctx.params.buttonType == null ? "" : ctx.params.listItems
                    const fromUserID = ctx.params.fromUserID == null ? "" : ctx.params.fromUserID
                    const advertID = ctx.params.advertID == null ? "" : ctx.params.advertID
                    const notification = await this.adapter.model.create({
                        title: ctx.params.title,
                        description: ctx.params.description,
                        userID: ctx.params.userID,
                        typeOfUser: ctx.params.typeOfUser,
                        listItems, buttonType, fromUserID, advertID
                    })
            
                    const result = await notification.save()
                    ctx.meta.$statusCode = 201

                    return result
                } catch (error) {
                  return {message: error.message}
                }
            }
        },
        setRead: {
            rest: "PUT /set_read",
            async handler(ctx) {
                try {
                    const notification = await this.adapter.model.findByIdAndUpdate(ctx.params.notificationID, { isRead: true })
                    if (notification == null) {
                        ctx.meta.$statusCode = 404
                        return { message: "NotFound" }
                    }
                    return notification
                } catch (error) {
                    ctx.meta.$statusCode = 400
                    return {message: error.message}
                }
            }
        },
    },
    methods: {
        getNotifications() {},
        getNotificationOne() {},
        createNotification() {},
        setRead() {},
    }
}