const express = require("express")
const uuid = require('uuid')

const port = 3000
const app = express() 
app.use (express.json())

const orders = []
 
const checkId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0 ) {
        return response.status(404).json({message: "order not found"})
    }

    request.orderIndex = index
    request.orderId = id
    next()
}

const checkURL = (request, response, next) => {
    console.log(`Method used: ${request.method} and the URL: /orders} `)

    next()
}

app.get ( "/orders", checkURL, (request, response) => {
    return response.json (orders)
})

app.post("/orders", (request, response ) => {
    const {order, clientName, price } = request.body
    const newOrders = 
    { id:uuid.v4(), order, clientName, price, status:"em preparação"}
    orders.push (newOrders)
    return response.status(201).json(newOrders)

})

app.put ( "/orders/:id", checkId, checkURL, (request, response) => {
    const id = request.orderId
    const {order, clientName, price } = request.body

    const updatedOrder = {id, order, clientName, price, status: "em preparação"}

    const index = request.orderIndex
    
    orders[index] = updatedOrder

    return response.json (updatedOrder)
})

app.delete ( "/orders/:id", checkId, checkURL, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.get ( "/orders/:id", checkId, checkURL, (request, response) => {
    const index = request.orderIndex

    return response.json(orders[index])
})

app.patch("/orders/:id", checkId, checkURL, (request, response) => {
    const index = request.orderIndex
    const id = request.orderId
    const {order, clientName, price } = orders[index]

    const preparedOrder = {id, order, clientName, price, status: "pedido Pronto"}

    orders[index] = preparedOrder

    return response.json(preparedOrder)
})

app.listen(port)