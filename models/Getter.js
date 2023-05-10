const mongoose = require("mongoose")

const GetterSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    market: {
        type: String,
        required: false
    },
    fcmToken: {
        type: String,
        required: false
    }
})


module.exports = mongoose.model("Getter", GetterSchema)