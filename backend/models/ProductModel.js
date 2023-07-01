const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please Provide name"],
		trim: true
	},
	description: {
		type: String,
		required: [true, "Please, provide description"]
	},
	price: {
		type: Number,
		required: [true, "Please provide price"],
		maxlength: [8, "price cannot exceed 8 characters"]
	},
	rating: {
		type: Number,
		default: 0
	},
	images: [
		{
			public_id: {
				type: String,
				required: true
			},
			url: {
				type: String,
				required: true
			}
		}
	],
	category: {
		type: String,
		required: [true, "Please provide product category"]
	},
	stock: {
		type: Number,
		maxlength: [true, "Stock cannot exceed 4 characters"],
		default: 1
	},
	numOfReviews: {
		type: Number,
		default: 0
	},
	reviews: [
		{
			name: {
				type: String,
				required: true
			},
			rating: {
				type: Number,
				required: true
			},
			comment: {
				type: String,
				required: true
			}
		}
	],
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
	createdAt: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model("Product", ProductSchema)
