const express = require("express")
const router = express.Router()

const {
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
} = require("../controllers/userController")

const {
	authenticateUser,
	authorizedPermissions
} = require("../middleware/authentication")

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

router.route("/logout").get(logoutUser)

// user
router.route("/showMe").get(authenticateUser, showCurrentUser)

router.route("/password/update").patch(authenticateUser, updateUserPassword)

router.route("/updateUser").patch(authenticateUser, updateUserProfile)

// Admin
router
	.route("/")
	.get([authenticateUser, authorizedPermissions("admin")], getAllUsers)
router
	.route("/:id")
	.get([authenticateUser, authorizedPermissions("admin")], getSingleUser)
	.patch([authenticateUser, authorizedPermissions("admin")], updateUserRole)
	.delete([authenticateUser, authorizedPermissions("admin")], deleteUser)

module.exports = router
