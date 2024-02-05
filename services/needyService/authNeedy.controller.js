let User = require("../models/Needy.js")
let { jwtsecret } = require("../configs/jwt.js")
let jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

module.exports.login = async (req, res) => {
  let user = await User.findOne({login: req.body.login, phone: req.body.phone}).exec()
  if (!user) return res.status(404).send({ token: "" })
  else {
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).send({ token: "" })
    else {
      let token = jwt.sign({
        sub: user._id,
        phone: user.phone,
        login: user.login,
        type: "needy"
      }, jwtsecret)
      return res.send({token: "Bearer " + token, user: user})
    }
  }
}

module.exports.signup = async (req, res, next) => {
  const isNeedyWithLogin = await User.findOne({ login: req.body.login }).exec()
  const isNeedyWithPhone = await User.findOne({ phone: req.body.phone }).exec()

  // if (isNeedyWithLogin != null) return res.status(403).send({ message: "Пользователь с таким логином уже существует" })
  // if (isNeedyWithPhone != null) return res.status(403).send({ message: "Пользователь с таким телефоном уже существует" })

  const salt = await bcrypt.genSalt(10)
  const password = await bcrypt.hash(req.body.password, salt);
  let isUserPhone = await User.findOne({ phone: req.body.phone, login: req.body.login }).exec()
  if (!isUserPhone) {
    let user = await User.create({ password, login: req.body.login, phone: req.body.phone, fcmToken: req.body.tokenFCM })
    let token = jwt.sign({
      sub: user._id,
      phone: user.phone,
      login: user.login,
      type: "needy",
    }, jwtsecret)
    return res.send({token: "Bearer " + token, user: user})
  }
  else return res.sendStatus(400).send({token: ""})
}

module.exports.test = async (req, res) => {
  res.send({isAuth: true}).status(200)
}
