const { StatusCodes } = require("http-status-codes")
const Order = require("../models/orderModel")
const Product = require("../models/ProductModel")
const { NotFoundError } = require("../errors/custom-error")

// Create new Order
const newOrder = async (req, res) => {
	const {
		shippingInfo,
		orderItems,
		paymentInfo,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice
	} = req.body

	const order = await Order.create({
		shippingInfo,
		orderItems,
		paymentInfo,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
		paidAt: Date.now(),
		user: req.user._id
	})

	res.status(StatusCodes.CREATED).json({ success: true, order })
}

// get single order
const getSingleOrder = async (req, res) => {
	const order = await Order.findById(req.params.id).populate(
		"user",
		"name email"
	)

	if (!order) {
		throw new NotFoundError(`Order not found with the id: ${req.params.id}`)
	}

	res.status(StatusCodes.OK).json({ success: true, order })
}

// get loggedIn user order
const myOrders = async (req, res) => {
	const orders = await Order.find({ user: req.user._id })

	res.status(StatusCodes.OK).json({ success: true, orders })
}

// Get all orders -- Admin
const getAllOrders = async (req, res) => {
	const orders = await Order.find()

	let totalAmount = 0

	orders.forEach((order) => {
		totalAmount += order.totalPrice
	})

	res.status(StatusCodes.OK).json({ success: true, totalAmount, orders })
}

// Update order status -- Admin
const updateOrder = async (req, res) => {
	const order = await Order.findById(req.params.id)

	if (!order) {
		throw new NotFoundError("Order not found with this id")
	}

	if (order.orderStatus === "Delivered") {
		throw new BadRequestError("You have already delivered this products")
	}

	order.orderItems.forEach(async (item) => {
		await updateStock(item.product, item.quantity)
	})

	order.orderStatus = req.body.status

	if (req.body.status === "Delivered") {
		order.deliveredAt = Date.now()
	}

	await order.save({ validateBeforeSave: false })

	res.status(StatusCodes.OK).json({
		success: true,
		msg: "Order status updated"
	})
}

async function updateStock(id, quantity) {
	const product = await Product.findById(id)

	product.stock -= quantity

	await product.save({ validateBeforeSave: false })
}

// Delete order -- Admin
const deleteOrder = async (req, res) => {
	const order = await Order.findById(req.params.id)

	if (!order) {
		throw new NotFoundError("Order not found with this id")
	}

	await Order.findByIdAndDelete(req.params.id)

	res.status(StatusCodes.OK).json({
		success: true,
		msg: "Order deleted successful"
	})
}

module.exports = {
	newOrder,
	getSingleOrder,
	myOrders,
	getAllOrders,
	updateOrder,
	deleteOrder
}
