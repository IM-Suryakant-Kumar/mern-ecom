const Product = require("../models/ProductModel")
const { NotFoundError, BadRequestError } = require("../errors/custom-error")
const { StatusCodes } = require("http-status-codes")

// Get all product
const getAllProduct = async (req, res) => {
	const { name, category, numericFilters } = req.query
	const queryObject = {}

	if (name) {
		queryObject.name = { $regex: name, $options: "i" }
	}

	if (category) {
		queryObject.category = category
	}

	if (numericFilters) {
		const operatorMap = {
			">": "$gt",
			">=": "$gte",
			"=": "$eq",
			"<": "$lt",
			"<=": "$lte"
		}
		const regEx = /\b(<|>|>=|=|<|<=)\b/g
		let filters = numericFilters.replace(
			regEx,
			(match) => `-${operatorMap[match]}-`
		)

		const options = ["price", "rating", "stock", "numOfReviews"]
		filters = filters.split(",").forEach((item) => {
			const [field, operator, value] = item.split("-")
			if (options.includes(field)) {
				queryObject[field] = { [operator]: Number(value) }
			}
		})
	}

	const page = Number(req.query.page) || 1
	const limit = Number(req.query.limit) || 5
	const skip = (page - 1) * limit

	console.log(queryObject)

	const product = await Product.find(queryObject).skip(skip).limit(limit)
	res.status(200).json({ success: true, product, nbHits: product.length })
}

// Create product -- Admin
const createProduct = async (req, res) => {
	req.body.user = req.user.id

	const product = await Product.create(req.body)
	res.status(201).json({ success: true, product })
}

// Get single product
const getProduct = async (req, res, next) => {
	const product = await Product.findById(req.params.id)

	if (!product) {
		throw new NotFoundError("Product does not exist")
	}

	res.status(200).json({ success: true, product })
}

// Update Product -- admin
const updateProduct = async (req, res) => {
	const { name, description, price, category, images } = req.body

	let product = await Product.findById(req.params.id)

	if (!product) {
		throw new NotFoundError("Product does not exist")
	}

	product = await Product.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	})

	res.status(201).json({ success: true, product })
}

// Delete Product
const deleteProduct = async (req, res) => {
	const product = await Product.findById(req.params.id)

	if (!product) {
		throw new NotFoundError("Product does not exist")
	}

	await Product.findByIdAndDelete(req.params.id)

	res.status(200).json({ success: true, msg: "product deleted successful" })
}

// Create new review and update the review
const createProductReview = async (req, res) => {
	const { rating, comment, productId } = req.body

	const review = {
		user: req.user._id,
		name: req.user.name,
		rating: Number(rating),
		comment
	}

	const product = await Product.findById(productId)

	const isReviewed = product.reviews.find(
		(rev) => rev.user.toString() === req.user._id.toString()
	)

	if (isReviewed) {
		product.reviews.forEach((rev) => {
			if (rev.user.toString() === rev.user._id.toString())
				(rev.rating = rating), (rev.comment = comment)
		})
	} else {
		product.reviews.push(review)
		product.numOfReviews = product.reviews.length
	}

	let avg = 0
	product.reviews.forEach((rev) => {
		avg += rev.rating
	})

	product.ratings = avg / product.reviews.length

	await product.save({ validateBeforeSave: false })

	res.status(StatusCodes.OK).json({
		success: true,
		msg: "Reviwed Successful"
	})
}

// Get all reviews of a product
const getProductReviews = async (req, res) => {
	const product = await Product.findById(req.query.id)

	if (!product) {
		throw new NotFoundError("Product not found")
	}

	res.status(StatusCodes.OK).json({ success: true, reviews: product.reviews })
}

// delete reviews
const deleteReviews = async (req, res) => {
	const product = await Product.findById(req.query.productId)

	if (!product) {
		throw new NotFoundError("Product not found")
	}

	const reviews = product.reviews.filter(
		(rev) => rev._id.toString() !== req.query.id.toString()
	)

	let avg = 0
	reviews.forEach((rev) => {
		avg += rev.rating
	})

	const ratings = avg / reviews.length
	const numOfReviews = reviews.length

	await Product.findByIdAndUpdate(
		req.query.productId,
		{
			reviews,
			numOfReviews,
			ratings
		},
		{ new: true, runValidators: false }
	)

	res.status(StatusCodes.OK).json({
		success: true,
		msg: "One review deleted successfully"
	})
}

module.exports = {
	getAllProduct,
	createProduct,
	updateProduct,
	deleteProduct,
	getProduct,
	createProductReview,
	getProductReviews,
	deleteReviews
}
