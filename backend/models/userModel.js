const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please provide your name"],
		maxlength: [30, "Name cannot exceed 30 characters"],
		minlength: [4, "Name should have more than 4 chracters"]
	},
	email: {
		type: String,
		required: [true, "Please provide email"],
		validate: [validator.isEmail, "Please provide valid email"],
		unique: true
	},
	password: {
		type: String,
		required: [true, "Please provide password"],
		minlength: [6, "Password should be at least 6 characters long"],
		select: false
	},
	avatar: {
		public_id: {
			type: String,
			required: true
		},
		url: {
			type: String,
			required: true
		}
	},
	role: {
		type: String,
		default: "user"
	}

	// resetPasswordToken: String,
	// resetPassWordExpire: Date
})

// Hash Password
UserSchema.pre("save", async function () {
	if (!this.isModified("password")) return
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
})

// JWT Token
UserSchema.methods.createJWTToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_LIFETIME
	})
}

// Compare password
UserSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model("User", UserSchema)

// // Generating password reset token
// UserSchema.methods.getResetPasswordToken = function () {
// 	// generate token
// 	const resetToken = crypto.randomBytes(20).toString("hex")

// 	// Hashing and adding reset password token to userSchema
// 	this.resetPasswordToken = crypto
// 		.createHash("sha256")
// 		.update(resetToken)
// 		.digest("hex")

//     this.resetPassWordExpire = Date.now() + 15 * 60 * 1000

//     return resetToken
// }
