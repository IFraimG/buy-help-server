const needyController = require("./needy.controller.js")
let passport = require("../configs/passportS.js")

// const MicroMQ = require("micromq");

// const router = new MicroMQ({
//     name: "needy",
//     rabbit: {
//       url: process.env.RABBIT_URL,
//     },
// });

// нуждающийся прикрепляется к магазину 
router.put("/needy/set_market", passport.authenticate('jwt', { session: false }), needyController.setMarket)

router.put("/needy/edit_profile", passport.authenticate('jwt', { session: false }), needyController.editProfile)

router.get("/needy/get_token/:authorID", passport.authenticate('jwt', { session: false }), needyController.getToken)

router.put("/needy/change_token", passport.authenticate('jwt', { session: false }), needyController.changeToken)

// router.start().then(() => {
//     console.log("Needy Service is on");
// })
