const mongoose = require("mongoose")
const dayjs = require("dayjs")
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const MessageSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    chatID: {
        type: String,
        required: true
    },
    authorID: {
        type: String,
        required: true
    },
    dateCreated: {
        type: String,
        default: dayjs().tz("Europe/Moscow").format('YYYY-MM-DD HH:mm:ss')
    }
})


module.exports = mongoose.model("Message", MessageSchema)