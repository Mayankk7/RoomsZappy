const express = require("express")
const router = express.Router();
const { getUsers, deleteUser } = require("../controllers/user");
const { registerUser, loginUser, resetPassword, forgotPassword } = require("../controllers/auth")


//Auth Route
//route to allows a user to register
//@public route /register
router.post("/register", registerUser)

//Auth Route
//route to login a user using email and password 
//@protected route validates only registered user
router.post("/login", loginUser)

//User Route 
//route to get all users on home screen 
//@protected route /getallusers
router.get('/getallusers', getUsers)


//Auth Route 
//route to generate a reset password request 
//@public route
router.post('/forgot', forgotPassword)


//Auth Route
//route to allow a user to reset password 
//@protected route 
router.patch('/reset/:id', resetPassword)

//User Route
//route to delete a user from database
//@protected route only for admins
router.delete('/deleteuser/:id', deleteUser)

module.exports = router;