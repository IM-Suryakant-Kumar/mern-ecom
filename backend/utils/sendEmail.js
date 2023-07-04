const nodeMailer = require("nodemailer")

const sendEmail = async (options) => {
	const transporter = nodeMailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		secure: false,
        requireTLS: true,
		auth: {
			user: process.env.SMPT_MAIL,
			pass: process.env.SMPT_PASSWORD
		}
	})

	const mailOptions = {
		from: process.env.SMPT_MAIL,
		to: options.email,
		subject: options.subject,
		text: options.message
	}

	await transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
            console.error(err)
        } else {
            console.log("gmail was sent", info.response)
        }
    })
}

module.exports = sendEmail
