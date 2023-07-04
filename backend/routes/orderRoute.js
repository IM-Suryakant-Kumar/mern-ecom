const express = require("express")
const router = express.Router()

const {
	newOrder,
	getSingleOrder,
	myOrders,
	getAllOrders,
	updateOrder,
	deleteOrder
} = require("../controllers/orderController")
const {
	authenticateUser,
	authorizedPermissions
} = require("../middleware/authentication")

router.route("/new").post(authenticateUser, newOrder)

router.route("user/:id").get(authenticateUser, getSingleOrder)

router.route("/me").get(authenticateUser, myOrders)

router
	.route("/admin/orders")
	.get([authenticateUser, authorizedPermissions("admin")], getAllOrders)

router
	.route("/admin/order/:id")
	.patch([authenticateUser, authorizedPermissions("admin")], updateOrder)
	.delete([authenticateUser, authorizedPermissions("admin")], deleteOrder)

module.exports = router
