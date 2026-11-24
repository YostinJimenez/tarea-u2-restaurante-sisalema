const { Router } = require("express");
const { register, login } = require("../controllers/authController.js");
const authenticateToken = require("../middlewares/auth.js");
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/protected-route", authenticateToken, (req, res) => {
    res.send("<h1>Ruta protegida</h1>");
});


module.exports = router;