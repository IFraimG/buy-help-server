const mongoose = require("mongoose")
const dayjs = require("dayjs")
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const AdvertisementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    listProducts: {
        type: Array,
        required: false
    },
    authorName: {
        type: String,
        required: true
    },
    advertsID: {
        type: String,
        required: true,
        unique: true
    },
    gettingProductID: String,
    authorID: {
        type: String,
        required: true
    },
    dateOfCreated: {
        type: String,
        default: dayjs().tz("Europe/Moscow").format('YYYY-MM-DD HH:mm:ss')
    },
    dateDone: {
        type: String,
        required: false
    },
    isSuccessDone: {
        type: String,
        default: false
    },
    userDoneID: {
        type: String, 
        required: false
    },
    advertID: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model("Advertisement", AdvertisementSchema)