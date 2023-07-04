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
	getProduct,
	createProductReview,
	getProductReviews,
	deleteReviews
} = require("../controllers/productController")

router.route("/").get(getAllProduct)

router
	.route("/new")
	.post([authenticateUser, authorizedPermissions("admin")], createProduct)

router
	.route("admin/:id")
	.patch([authenticateUser, authorizedPermissions("admin")], updateProduct)
	.delete([authenticateUser, authorizedPermissions("admin")], deleteProduct)

router.route("product/:id").get(getProduct)

router.route("/reviews").patch(authenticateUser, createProductReview)

router
	.route("/reviews")
	.get(getProductReviews)
	.delete(authenticateUser, deleteReviews)

module.exports = router
