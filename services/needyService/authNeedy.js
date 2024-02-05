let express = require("express")
let router = express.Router()
let passport = require("../configs/passportS.js")
const authNeedyController = require("../controllers/authNeedy.controller.js")

router.post("/login", authNeedyController.login)

router.post('/signup', authNeedyController.signup)

router.get("/test", passport.authenticate('jwt', { session: false }), authNeedyController.test)

module.exports = router;