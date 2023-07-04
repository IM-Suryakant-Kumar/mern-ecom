require("express-async-errors")

const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")

const errorHandlerMiddleware = require("./middleware/error-handler")
const notFoundMiddleware = require("./middleware/not-found")

app.use(express.json())
app.use(cookieParser())

// imports route
const products = require("./routes/productRoute")
const users = require("./routes/userRoute")
const orders = require("./routes/orderRoute")

app.use("/api/v1/products", products)
app.use("/api/v1/users", users)
app.use("/api/v1/orders", orders)

// error handler
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

module.exports = app
