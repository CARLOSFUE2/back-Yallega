let express = require("express")
let router = express.Router()
const Request = require("../models/request")
const User = require("../models/users")
const Billing = require("../models/billing")
const { requestMatrixDistane } = require("../controllers/distanceMatrix")
const { price } = require("../controllers/calculatePrice")
const Token = require("../models/tokens")
const { sendNotification } = require("../controllers/notifications")
const Client = require("../models/client")
const { ordenateResponse } = require("../services/ordenateAndPaginateResponse")
const STATUS = [
  "En Espera",
  "Asignado",
  "En Proceso",
  "Entregado",
  "Rechazado",
  "Devuelto",
  "Retirado",
  "Cancelado",
]

router.get("/", async (req, res) => {
  const request = await Request.find()
  let response = ordenateResponse(request)
  res.json(response)
})

router.get("/available", async (req, res) => {
  const request = await Request.find()
  let response = request.filter((request) => request.status == STATUS[0])
  response = ordenateResponse(response)
  res.json(response)
})

router.get("/client/:id", async (req, res) => {
  const id = req.params.id
  let response = []
  const request = await Request.find()
  const clients = await User.find()
  let requestMatch = []
  request.forEach((e) => {
    if (e.clientId == id) {
      requestMatch.push(e)
    }
  })
  requestMatch.forEach((req) => {
    let coincidencias = clients.filter((client) => req.userId == client._id)
    let formatResponse = {
      _id: req._id,
      product: req.product,
      client: coincidencias[0].name,
      numberPhone: coincidencias[0].numberPhone,
      status: req.status,
      price: req.value,
      address: req.destiny,
    }
    response.push(formatResponse)
  })
  response = ordenateResponse(response)
  res.json(response)
})

router.get("/deliver/:id", async (req, res) => {
  const id = req.params.id
  const requests = await Request.find({ deliveryId: id })
  let response = ordenateResponse(requests)
  res.send(response)
})

router.get("/:id", async (req, res) => {
  const id = req.params.id
  const request = await Request.findById({ _id: id })
  const listClients = await User.find()
  let clients = listClients.filter((client) => request.userId == client._id)
  let formatResponse = {
    _id: request._id,
    product: request.product,
    client: clients[0].name,
    numberPhone: clients[0].numberPhone,
    status: request.status,
    price: request.value,
    destiny: request.destiny,
    origin: request.origin,
    destinyUrl: request.destinyUrl,
    originUrl: request.originUrl,
    distance: request.distance,
    reference: request.reference,
    productValue: request.paymentForRquest, //aqui me equivoque y hay que corregirlo mas adelante
    value: request.productValue,
    destinationCharge: request.destinationCharge,
    deliveryId: request.deliveryId,
  }
  res.send(formatResponse)
})

router.post("/distance", async (req, res) => {
  let request = req.body
  let origin = {
    lat: request.origin.lat,
    lng: request.origin.lng,
  }
  let destiny = {
    lat: request.destiny.lat,
    lng: request.destiny.lng,
  }
  request.originUrl = request.origin.url
  request.destinyUrl = request.destiny.url
  request.origin = request.origin.name
  request.destiny = request.destiny.name

  //aqui
  let client = await Client.findById({ _id: request.clientId })
  let matrix = await requestMatrixDistane(origin, destiny)
  let value = await price(matrix, client.type)
  //aqui
  const response = {
    distance: matrix,
    value: value.cost,
    paymentForRquest: value.deliverCost,
  }
  res.send(response)
})

router.post("/", async (req, res) => {
  let request = req.body
  request.originUrl = request.origin.url
  request.destinyUrl = request.destiny.url
  request.origin = request.origin.name
  request.destiny = request.destiny.name
  let date = new Date()
  request = {
    date,
    status: STATUS[0],
    ...request,
  }

  const create = await Request.create(request)
  const clientId = request.clientId
  const billingList = await Billing.find({ clientId })
  let tokens = await Token.find()
  let listTokens = organiceTokens(tokens)
  let notificacion = await sendNotification(listTokens)

  if (billingList.length == 0) {
    const newBilling = {
      client: request.client,
      clientId: request.clientId,
      services: [
        {
          id: request._id,
          product: request.product,
          value: request.value,
        },
      ],
      total: request.value,
      dateExp: new Date(),
      active: true,
      number: 1,
      factureDeliver: false,
    }
    const billingCreate = await Billing.create(newBilling)
  } else {
    let listBillings = billingList.filter((billing) => billing.active == true)
    if (listBillings.length > 0) {
      const billingActive = listBillings[0]
      billingActive.services.push({
        id: create._id,
        product: request.product,
        value: request.value,
      })
      billingActive.total = billingActive.total + request.value
      const billlingUpdate = await Billing.updateOne(
        { _id: billingActive._id },
        billingActive
      )
    } else {
      const newBilling = {
        client: request.client,
        clientId: request.clientId,
        services: [
          {
            id: request._id,
            product: request.product,
            value: request.value,
          },
        ],
        total: request.value,
        dateExp: new Date(),
        active: true,
        number: billingList[billingList.length - 1].number + 1,
        factureDeliver: false,
      }
      const billingCreate = await Billing.create(newBilling)
    }
  }
  res.send(create)
})

router.put("/cancelDeliver", async (req, res) => {
  const request = req.body.request
  const deliver = req.body.deliver
  request.productValue = request.productValue * -0.3
  request.product = request.product + " - multa por cancelacion"

  const billingList = await Billing.find({ clientId: deliver._id })
  const billingActive = billingList.filter(
    (billing) => billing.active == true
  )[0]
  if (billingList.length == 0 || !billingActive) {
    createNewBilling(deliver, request)
  } else {
    billingActive.services.push({
      id: request._id,
      product: request.product,
      value: request.productValue,
    })
    billingActive.total = billingActive.total + request.productValue
    const billlingUpdate = await Billing.updateOne(
      { _id: billingActive._id },
      billingActive
    )
  }
})

router.put("/select/:id", async (req, res) => {
  const id = req.params.id
  const status = req.body.status.status
  const deliver = req.body.status.deliver
  const updateRequest = await Request.updateOne(
    { _id: id },
    { $set: { status: STATUS[status], deliveryId: deliver._id } }
  )
  const request = await Request.findById({ _id: id })

  if (status == 3) {
    const billingList = await Billing.find({ clientId: deliver._id })
    const billingActive = billingList.filter(
      (billing) => billing.active == true
    )[0]
    if (billingList.length == 0 || !billingActive) {
      createNewBilling(deliver, request)
    } else {
      billingActive.services.push({
        id: request._id,
        product: request.product,
        value: request.paymentForRquest,
      })
      billingActive.total = billingActive.total + request.paymentForRquest
      const billlingUpdate = await Billing.updateOne(
        { _id: billingActive._id },
        billingActive
      )
    }
  }

  res.json(request)
})

router.put("/modify/:id", async (req, res) => {
  const id = req.params.id
  let request = req.body
  request.originUrl = request.origin.url
  request.destinyUrl = request.destiny.url
  request.origin = request.origin.name
  request.destiny = request.destiny.name
  request = {
    status: STATUS[0],
    ...request,
  }
  const requestUpdate = await Request.updateOne(
    { _id: id },
    request
  )

  const clientId = request.clientId
  const billingList = await Billing.find({ clientId })

    let listBillings = billingList.filter((billing) => billing.active == true)
    if (listBillings.length > 0) {
      const billingActive = listBillings[0]
      const service = billingActive.services.filter((service) => service.id == id)[0];
      const indexOfServiceModify = billingActive.services.indexOf(service);
      billingActive.services.splice(indexOfServiceModify, 1);

      billingActive.services.push({
        id,
        product: request.product,
        value: request.value,
      })

      billingActive.total = billingActive.total + request.value - service.value
      const billlingUpdate = await Billing.updateOne(
        { _id: billingActive._id },
        billingActive
      )
    } 
  
  const requestBeforeUpdate = await Request.findById({ _id: id })
  res.send(requestBeforeUpdate);
})

router.delete("/all", async (req, res) => {
  const response = await Request.deleteMany()
  res.send(response)
})

router.delete("/cancel/:id/:clientId", async (req, res) => {
  const id = req.params.id
  const clientId = req.params.clientId
  const cancelStatus = STATUS[7]
  const request = await Request.findById({ _id: id })
  const updateRequest = await Request.updateOne(
    { _id: id },
    {
      $set: {
        status: cancelStatus,
        value: 1000,
        reference:
          "Este pedido fue cancelado el dia " + new Date().toLocaleString(),
      },
    }
  )
  const requestCancel = await Request.findById({ _id: id })
  const billingList = await Billing.find({ clientId })
  let billingActive
  billingList.forEach((billing) => {
    if (billing.active == true) {
      billingActive = billing
    }
  })
  const servicesIntoBillingActive = billingActive.services
  let newTotal = 0
  servicesIntoBillingActive.forEach((service) => {
    if (service.id && service.id == id) {
      service.product = service.product + "- multa por cancelar pedido"
      service.value = 1000
    }
    newTotal = newTotal + service.value
  })
  const updateBilling = await Billing.updateOne(
    { _id: billingActive._id },
    { $set: { services: servicesIntoBillingActive, total: newTotal } }
  )
  res.json(requestCancel)
})

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id
  const response = await Request.findByIdAndDelete({ _id: id })
  res.json(response)
})

function organiceTokens(tokens) {
  let list = []
  tokens.forEach((token) => {
    list.push(token.token)
  })
  return list
}

async function createNewBilling(deliver, request) {
  const newBilling = {
    client: deliver.name,
    clientId: deliver._id,
    services: [
      {
        id: request._id,
        product: request.product,
        value: request.paymentForRquest,
      },
    ],
    total: request.paymentForRquest,
    dateExp: new Date(),
    active: true,
    number: 1,
    factureDeliver: true,
  }
  const billingCreate = await Billing.create(newBilling)
}

module.exports = router;
