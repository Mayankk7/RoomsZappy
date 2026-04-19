const express = require("express")
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/rbacMiddleware");
const { registerUser, loginUser, getCurrentUser, sendRegisterOtp, verifyRegisterOtp } = require("../controllers/auth");
const { getUsers, assignRole, deleteUser } = require("../controllers/user");

router.post("/register", registerUser);
router.post("/send-register-otp", sendRegisterOtp);
router.post("/verify-register-otp", verifyRegisterOtp);
router.post("/login", loginUser);
router.get("/me", authenticate, getCurrentUser);
router.get("/", authenticate, authorizeRoles('super_admin', 'manager'), getUsers);
router.patch("/:id/role", authenticate, authorizeRoles('super_admin'), assignRole);
router.delete("/:id", authenticate, authorizeRoles('super_admin'), deleteUser);

module.exports = router;