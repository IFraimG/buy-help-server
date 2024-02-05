let express = require("express")
let router = express.Router()
let passport = require("../configs/passportS.js")
const authGiverController = require("../controllers/authGiver.controller.js")

router.post("/login", authGiverController.login)

router.post('/signup', authGiverController.signup)

router.get("/test", passport.authenticate('jwt', { session: false }), authGiverController.test)

module.exports = router;