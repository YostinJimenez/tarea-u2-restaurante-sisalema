const { Router } = require("express");
const authenticateToken = require("../middlewares/auth");
const {
    createOrderRating,
    listOrderRatings,
    deleteOrderRating,
} = require("../controllers/orderRatingController");

const router = Router();

router.get("/", listOrderRatings);
router.post("/", authenticateToken, createOrderRating);
router.delete("/:id", authenticateToken, deleteOrderRating);

module.exports = router;
