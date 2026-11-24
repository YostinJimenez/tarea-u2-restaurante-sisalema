const {
    createOrderService,
    listOrdersWithDishService,
    getOrderByIdService,
    deleteOrderService,
} = require("../services/orderService");

const handleOrderError = (res, error) => {
    if (error.status) {
        return res.status(error.status).json({ error: error.message });
    }
    if (error.code === "P2025") {
        return res.status(404).json({ error: "Pedido no encontrado" });
    }
    return res.status(500).json({ error: "Error interno del servidor" });
};

const createOrder = async (req, res) => {
    try {
        const order = await createOrderService(req.body, req.user.id);
        return res.status(201).json(order);
    } catch (error) {
        return handleOrderError(res, error);
    }
};

const listOrders = async (req, res) => {
    try {
        const orders = await listOrdersWithDishService(req.user.id);
        return res.status(200).json(orders);
    } catch (error) {
        return handleOrderError(res, error);
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await getOrderByIdService(req.params.id, req.user.id);
        return res.status(200).json(order);
    } catch (error) {
        return handleOrderError(res, error);
    }
};

const deleteOrder = async (req, res) => {
    try {
        const result = await deleteOrderService(req.params.id, req.user.id);
        return res.status(200).json(result);
    } catch (error) {
        return handleOrderError(res, error);
    }
};

module.exports = {
    createOrder,
    listOrders,
    getOrderById,
    deleteOrder,
};
