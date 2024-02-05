let passport = require("passport")
let JwtStrategy = require("passport-jwt").Strategy
let ExtractJwt = require("passport-jwt").ExtractJwt
let Giver = require("../services/giverService/Giver.js")
let Needy = require("../services/needyService/Needy.js")
let { jwtsecret } = require("./jwt")

let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = jwtsecret


passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      let user = null
      if (jwtPayload.type == "needy") {
        user = await Needy.findOne({_id: jwtPayload.sub})
      } else user = await Giver.findOne({authID: jwtPayload.sub})

      if (user) done(null, user)
      else done(null, false)
    } catch (error) { return done(error, false) }
  })
)

module.exports = passport