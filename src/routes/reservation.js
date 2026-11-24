const { Router } = require("express");
const reservationsController = require("../controllers/reservationsController.js");
const authenticateToken = require("../middlewares/auth.js");
const { route } = require("./auth.js");
const router = Router();

router.post("/", authenticateToken, reservationsController.createReservation);
router.get("/:id", authenticateToken, reservationsController.getReservation);
router.post("/:id", authenticateToken, reservationsController.updateReservation);
router.delete("/:id", authenticateToken, reservationsController.deleteReservation);

module.exports = router;