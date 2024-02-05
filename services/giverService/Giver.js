const mongoose = require("mongoose")

const GiverSchema = new mongoose.Schema({
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
    authID: {
        type: String,
        required: true
    },
    fcmToken: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model("Giver", GiverSchema)