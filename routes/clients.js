let express = require("express")
let router = express.Router()
const Client = require("../models/client")

const typeCients = ["Estandar", "Especial", "Destacada"]

router.get("/", async (req, res) => {
  const clients = await Client.find()
  res.json(clients)
})

router.post("/register", async (req, res) => {
  const isClient = await Client.findOne({ email: req.body.email })
  if (isClient) {
      const error = {
          message: 'Ya este correo electronico fue registrado a un usuario, intente con otro o contactese con nosotros'
      }
      res.json(error)
  } else {
    let clientCreate = { ...req.body, type: typeCients[0] }
    const client = await Client.create(clientCreate)
    res.json(clientCreate)
  } 
})

router.put("/change-type/:id", async (req, res) => {
  const id = req.params.id
  const client = await Client.updateOne(
    { _id: id },
    { $set: { type: req.body.type } }
  )
  res.json(client)
})

router.post("/login", async (req, res) => {
  const client = await Client.findOne({ email: req.body.email })
  if (client == null) {
    res.json({ message: "no existe un usuario registrado con este email" })
  } else if (client.password !== req.body.password) {
    res.json({ message: "la clave es incorrecta" })
  } else {
    res.json(client)
  }
})

router.get("/delete", async (req, res) => {
  const resp = await Client.deleteMany()
  res.json(resp)
})

module.exports = router
