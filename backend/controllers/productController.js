const Product = require("../models/ProductModel")
const { NotFoundError, BadRequestError } = require("../errors/custom-error")

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

module.exports = {
	getAllProduct,
	createProduct,
	updateProduct,
	deleteProduct,
	getProduct
}
