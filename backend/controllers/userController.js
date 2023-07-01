const User = require("../models/userModel")
const { StatusCodes } = require("http-status-codes")
const {
	BadRequestError,
	UnauthenticatedError
} = require("../errors/custom-error")
const sendToken = require("../utils/jwtToken")

// Register a user
const registerUser = async (req, res) => {
	const { name, email, password } = req.body

	const user = await User.create({
		name,
		email,
		password,
		avatar: {
			public_id: "this is sampleid",
			url: "sample url"
		}
	})

    sendToken(user, StatusCodes.CREATED, res )
}

// Login user
const loginUser = async (req, res) => {
	const { email, password } = req.body

	if (!(email && password)) {
		throw new BadRequestError("Please provide email and password")
	}

	const user = await User.findOne({ email }).select("+password")

	if (!user) {
		throw new UnauthenticatedError("Invalid credentials!")
	}

	const isPasswordCorrect = user.comparePassword(password)
	if (!isPasswordCorrect) {
		throw new UnauthenticatedError("Invalid credentials")
	}

    sendToken(user, StatusCodes.OK, res )
}

// Logout user
const logoutUser = async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(StatusCodes.OK).json({success: true, msg: "Logged Out"})
}

module.exports = {
	registerUser,
	loginUser,
    logoutUser
}
