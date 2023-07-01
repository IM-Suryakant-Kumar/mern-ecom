require("dotenv").config({ path: "backend/.env" })

// connectBD
const connectDB = require("./db/connect")

const app = require("./app")

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI)
		app.listen(process.env.PORT, () => {
			console.log(`Server is listening on port ${process.env.PORT}`)
		})
	} catch (error) {
		console.log(error)
	}
}

start()
