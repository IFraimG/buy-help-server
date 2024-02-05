const express = require('express');
const router = express.Router();
const settersController = require("../controllers/giver.controller")
let passport = require("../../configs/passportS.js")

router.put("/set_market", passport.authenticate('jwt', { session: false }), settersController.setMarket)

router.get("/get_token/:authorID", passport.authenticate('jwt', { session: false }), settersController.getToken)

router.put("/edit_profile", passport.authenticate('jwt', { session: false }), settersController.editProfile)

router.put("/change_token", passport.authenticate('jwt', { session: false }), settersController.changeToken)


module.exports = router;
