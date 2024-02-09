const mongoose = require("mongoose")
const dayjs = require("dayjs")

const NotificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    typeOfUser: {
        type: String,
        required: true
    },
    fromUserID: {
        type: String,
        required: false
    },
    buttonType: {
        type: String,
        required: false
    },
    listItems: {
        type: Array,
        required: false
    },
    isRead: {
      type: Boolean,
      default: false  
    },
    createdAt: {
        type: String,
        default: () => dayjs().format("DD:MM:YY")
    },
    advertID: {
        type: String,
        required: false
    }
})


module.exports = mongoose.model("Notification", NotificationSchema)