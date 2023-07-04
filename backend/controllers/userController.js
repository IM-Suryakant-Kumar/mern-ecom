const User = require("../models/userModel")
const { StatusCodes } = require("http-status-codes")
const {
	BadRequestError,
	UnauthenticatedError,
	NotFoundError
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

	sendToken(user, StatusCodes.CREATED, res)
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

	sendToken(user, StatusCodes.OK, res)
}

// Logout user
const logoutUser = async (req, res) => {
	res.cookie("token", null, {
		expires: new Date(Date.now()),
		httpOnly: true
	})

	res.status(StatusCodes.OK).json({ success: true, msg: "Logged Out" })
}

// Show current user
const showCurrentUser = async (req, res) => {
	const user = await User.findById(req.user.id)

	res.status(StatusCodes.OK).json({ success: true, user })
}

// Update user password
const updateUserPassword = async (req, res) => {
	const { oldPassword, newPassword, confirmPassword } = req.body

	const user = await User.findById(req.user.id).select("+password")

	const isPasswordCorrect = user.comparePassword(oldPassword)

	if (!isPasswordCorrect) {
		throw new UnauthenticatedError("Incorrect old password")
	}

	if (newPassword !== confirmPassword) {
		throw new BadRequestError("Password does not match")
	}

	user.password = newPassword

	await user.save()

	sendToken(user, StatusCodes.OK, res)
}

// Update user profile
const updateUserProfile = async (req, res) => {
	const { name, email } = req.body

	const newUserData = {}

	if (name) {
		newUserData.name = name
	}

	if (email) {
		newUserData.email = email
	}

	await User.findByIdAndUpdate(req.user.id, newUserData, {
		new: true,
		runValidators: true
	})

	res.status(StatusCodes.OK).json({ success: true, msg: "Profile Updated successfully" })
}

// get All users
const getAllUsers = async (req, res) => {
	const users = await User.find()

	res.status(StatusCodes.OK).json({ success: true, users })
}

// get single user --Admin
const getSingleUser = async (req, res) => {
	const user = await User.findById(req.params.id)

	if (!user) {
		throw new NotFoundError(`No user exist with the id: ${req.params.id}`)
	}

	res.status(StatusCodes.OK).json({
		success: true,
		user
	})
}

const updateUserRole = async (req, res) => {
	const { name, email, role } = req.body

	const newUserData = {}

	if (name) {
		newUserData.name = name
	}

	if (email) {
		newUserData.email = email
	}

	if (role) {
		newUserData.role = role
	}

	await User.findByIdAndUpdate(req.user.id, newUserData, {
		new: true,
		runValidators: true
	})

	res.status(StatusCodes.OK).json({ success: true, msg: "Role updated successfully"  })
}

// delete user
const deleteUser = async (req, res) => {
	const user = await User.findById(req.params.id)

	if (!user) {
		throw new NotFoundError(`No user exist with the id: ${req.params.id}`)
	}

	await user.deleteOne({_id: req.params.id})

	res.status(StatusCodes.OK).json({ success: true, msg: "User deleted successfully" })
}

module.exports = {
	registerUser,
	loginUser,
	logoutUser,
	showCurrentUser,
	updateUserPassword,
	updateUserProfile,
	getAllUsers,
	getSingleUser,
	updateUserRole,
	deleteUser
}

// // Forgot Password
// const forgotPassword = async (req, res) => {
//     const { email } = req.body

//     const user = await User.findOne({ email })

//     if (!user) {
//         throw new NotFoundError(`No user exist with the email ${email}`)
//     }

//     // Get resetPassword Token
//     const resetToken = user.getResetPasswordToken()

//     await user.save({ validateBeforeSave: false })

//     const resetPasswordUrl = `${req.protocol}://${req.get(
//         "host"
//     )}/api/v1/users/password/reset/${resetToken}`

//     const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nif you have not requsted this email then, please ignore it`

//     try {

//         // await sendEmail({
//         //     email: user.email,
//         //     subject: "Ecommerce password recovery",
//         //     message
//         // })

//         const transporter = nodeMailer.createTransport({
//             host: "smtp.gmail.com",
//             port: 587,
//             secure: false,
//             requireTLS: true,
//             auth: {
//                 user: process.env.SMPT_MAIL,
//                 pass: process.env.SMPT_PASSWORD
//             }
//         })

//         const mailOptions = {
//             from: process.env.SMPT_MAIL,
//             to: user.email,
//             subject: "Ecommerce password recovery",
//             text: message
//         }

//         transporter.sendMail(mailOptions, (err, info) => {
//             if(err) {
//                 console.error(err)
//             } else {
//                 console.log("gmail was sent", info.response)
//             }
//         })

//         res.status(StatusCodes.OK).json({
//             success: true,
//             message: `Email sent to ${user.email} successfully`
//         })

//     } catch (error) {
//         user.resetPasswordToken = undefined
//         user.resetPassWordExpire = undefined

//         user.save({ validateBeforeSave: false })

//         return new BadRequestError(error.message)
//     }
// }
