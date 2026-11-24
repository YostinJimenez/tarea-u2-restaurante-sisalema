const { Router } = require("express");
const authenticateToken = require("../middlewares/auth");
const {
    createOrder,
    listOrders,
    getOrderById,
    deleteOrder,
} = require("../controllers/orderController");

const router = Router();

router.use(authenticateToken);

router.post("/", createOrder);
router.get("/", listOrders);
router.get("/:id", getOrderById);
router.delete("/:id", deleteOrder);

module.exports = router;
