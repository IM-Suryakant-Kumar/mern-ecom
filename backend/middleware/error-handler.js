const { StatusCodes } = require("http-status-codes")

const errorHandlerMiddleware = async (err, req, res, next) => {
	err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
	err.message = err.message || "Internal server error"

	if (err.name === "ValidationError") {
		err.message = Object.values(err.errors)
			.map((item) => item.message)
			.join(",")
	}

	if (err.code && err.code === 11000) {
		err.message = `Duplicate value entered for ${Object.keys(
			err.keyValue
		)} field, please choose another value`
        err.statusCode = StatusCodes.BAD_REQUEST
	}

	if (err.name === "CastError") {
		err.message = `Product with id ${err.value} does not exist`
        err.statusCode = StatusCodes.NOT_FOUND
	}

    if(err.name === "JsonWebTokenError") {
        err.message = "Json Web Token is invalid, Try again"
        err.statusCode = StatusCodes.BAD_REQUEST
    }
    
    if(err.name === "TokenExpiredError") {
        err.message = "Json Web Token is Expired, Try again"
        err.statusCode = StatusCodes.BAD_REQUEST
    }

	res.status(err.statusCode).json({ msg: err.message })
	// res.status(err.statusCode).json({ success: false, err: err })
}

module.exports = errorHandlerMiddleware
