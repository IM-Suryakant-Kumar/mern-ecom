const { UnauthenticatedError, UnauthorizedError } = require("../errors/custom-error")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

const authenticateUser = async (req, res, next) => {
	const { token } = req.cookies

	if (!token) {
		throw new UnauthenticatedError("Authentication Invalid")
	}

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decodedData.id)
        next()
    } catch (error) {
        throw new UnauthenticatedError("Authentication Invalid")
    }

}

const authorizedPermissions = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            throw new UnauthorizedError("Unauthorized to access this route")
        }

        next()
    }
}

module.exports = {
    authenticateUser,
    authorizedPermissions
}
