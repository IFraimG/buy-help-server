const Giver = require("./Giver")
const bcrypt = require("bcrypt")

// module.exports.setMarket = async (req, res) => {
//   try {
//     let result = await Giver.findByIdAndUpdate(req.body.userID, { market: req.body.market }).exec()
//     return res.status(200).send(result)
//   } catch (error) {
//     return res.status(400).send({ message: "Error" })
//   }
// }

// module.exports.getToken = async (req, res) => {
//   try {
//     let giver = await Giver.findById(req.params.authorID).exec()
//     if (giver == null) return res.status(404).send({ message: "NotFound" })
    
//     res.status(200).send({ fcmToken: giver.fcmToken })
//   } catch (error) {
//     console.log(error.message);
//     return res.status(400).send({message: error.message})
//   }
// }

// module.exports.editProfile = async (req, res) => {
//   try {
//     let giver = await Giver.findById(req.body.userID).exec()

//     const match = await bcrypt.compare(req.body.old_password, giver.password);
//     if (!match) return res.status(400).send({ message: "Incorrect Password" })

//     // const isGiverWithLogin = await Giver.findOne({ login: req.body.login, _id: { $ne: req.body.userID } }).exec()
//     // if (isGiverWithLogin != null) return res.status(403).send({ message: "Пользователь с таким логином уже существует" })

//     // const isGiverWithPhone = await Giver.findOne({ phone: req.body.phone, _id: { $ne: req.body.userID } }).exec()
//     // if (isGiverWithPhone != null) return res.status(403).send({ message: "Пользователь с таким телефоном уже существует" })

//     if (req.body?.login.length > 0) giver.login = req.body.login
//     if (req.body?.phone.length > 0) giver.phone = req.body.phone
//     if (req.body?.password.length > 0) {
//       const salt = await bcrypt.genSalt(10)
//       const password = await bcrypt.hash(req.body.password, salt);
//       giver.password = password
//     }
//     const result = await giver.save()
//     return res.status(201).send(result)
//   } catch (error) {
//     console.log(error.message);
//     return res.status(400).send({message: error.message})
  
//   }
// }

// module.exports.changeToken = async (req, res) => {
//   try {
//     let giver = await Giver.findByIdAndUpdate(req.body.userID, { fcmToken: req.body.token }).exec()
//     if (giver == null) return res.status(404).send({ message: "NotFound" })
    
//     return res.status(200).send(giver)
//   } catch (error) {
//     console.log(error.message);
//     return res.status(400).send({message: error.message})
//   }
// }