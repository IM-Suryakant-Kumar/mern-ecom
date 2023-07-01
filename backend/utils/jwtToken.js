// created token and saving in cookie

const sendToken = (user, statusCode, res) => {
	const token = user.createJWTToken()

	// Options for cookie
	const options = {
		exprires: new Date(
			Date.now + process.env.COOKIE_LIFETIME * 24 * 60 * 60 * 1000
		),
		httpOnly: true
	}

	res.status(statusCode)
		.cookie("token", token, options)
		.json({ success: true, user, token })
}

module.exports = sendToken
