const mongoose = require("mongoose")
const dayjs = require("dayjs")
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const ChatSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    users: {
        type: Array,
        required: true
    },
    dateCreated: {
        type: String,
        default: dayjs().tz("Europe/Moscow").format('YYYY-MM-DD HH:mm:ss')
    }
})


module.exports = mongoose.model("Chat", ChatSchema)