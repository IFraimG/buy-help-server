const Needy = require("../models/Needy")
const bcrypt = require("bcrypt")

// module.exports.setMarket = async (req, res) => {
//   try {
//     let result = await Needy.findByIdAndUpdate(req.body.userID, { market: req.body.market }).exec()
//     return res.status(200).send(result)
//   } catch (error) {
//     return res.status(400).send({message: error.message})
//   }
// }

// module.exports.editProfile = async (req, res) => {
//   try {
//     let needy = await Needy.findById(req.body.userID).exec()

//     const match = await bcrypt.compare(req.body.old_password, needy.password);
//     if (!match) return res.status(400).send({ message: "Incorrect Password" })

//     const isNeedyWithLogin = await Needy.findOne({ login: req.body.login, _id: { $ne: req.body.userID } }).exec()
//     if (isNeedyWithLogin != null) return res.status(403).send({ message: "Пользователь с таким логином уже существует" })

//     const isNeedyWithPhone = await Needy.findOne({ phone: req.body.phone, _id: { $ne: req.body.userID } }).exec()
//     if (isNeedyWithPhone != null) return res.status(403).send({ message: "Пользователь с таким телефоном уже существует" })

//     if (req.body?.login.length > 0) Needy.login = req.body.login
//     if (req.body?.phone.length > 0) Needy.phone = req.body.phone
//     if (req.body?.password.length > 0) {
//       const salt = await bcrypt.genSalt(10)
//       const password = await bcrypt.hash(req.body.password, salt);
//       needy.password = password
//     }
//     const result = await needy.save()
//     res.status(201).send(result)
//   } catch (error) {
//     console.log(error.message);
//     return res.status(400).send({message: error.message})
  
//   }
// }

// module.exports.getToken = async (req, res) => {
//   try {
//     let needy = await Needy.findById(req.params.authorID).exec()
//     if (needy == null) return res.status(404).send({ message: "NotFound" })
    
//     res.status(200).send({ fcmToken: needy.fcmToken })
//   } catch (error) {
//     console.log(error.message);
//     return res.status(400).send({message: error.message})
//   }
// }

// module.exports.changeToken = async (req, res) => {
//   try {
//     let needy = await Needy.findByIdAndUpdate(req.body.userID, { fcmToken: req.body.token }).exec()
//     if (needy == null) return res.status(404).send({ message: "NotFound" })
    
//     res.status(200).send(needy)
//   } catch (error) {
//     console.log(error.message);
//     return res.status(400).send({message: error.message})
//   }
// }