const express = require("express")
const router = express.Router()
const {
	authenticateUser,
	authorizedPermissions
} = require("../middleware/authentication")

const {
	getAllProduct,
	createProduct,
	updateProduct,
	deleteProduct,
	getProduct
} = require("../controllers/productController")

router.route("/").get(getAllProduct)

router
	.route("/new")
	.post([authenticateUser, authorizedPermissions("admin")], createProduct)

router
	.route("/:id")
	.get(getProduct)
	.patch(authenticateUser, updateProduct)
	.delete(authenticateUser, deleteProduct)

module.exports = router
