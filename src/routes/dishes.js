const { Router } = require("express");
const authenticateToken = require("../middlewares/auth");
const {
    createDish,
    listDishes,
    getDishById,
    updateDish,
    deleteDish,
} = require("../controllers/dishController");

const router = Router();

router.get("/", listDishes);
router.get("/:id", getDishById);
router.post("/", authenticateToken, createDish);
router.put("/:id", authenticateToken, updateDish);
router.delete("/:id", authenticateToken, deleteDish);

module.exports = router;
