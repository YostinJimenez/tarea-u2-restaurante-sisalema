const {
    createOrderRatingService,
    listOrderRatingsService,
    deleteOrderRatingService,
} = require("../services/orderRatingService");

const handleRatingError = (res, error) => {
    if (error.status) {
        return res.status(error.status).json({ error: error.message });
    }
    if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ error: "Datos de calificación inválidos", errors });
    }
    if (error.name === "CastError") {
        return res
            .status(400)
            .json({ error: `Valor inválido para ${error.path}: ${error.value}` });
    }
    if (error.code === 11000) {
        return res
            .status(409)
            .json({ error: "Este pedido ya cuenta con una calificación registrada" });
    }
    return res.status(500).json({ error: "Error interno del servidor" });
};

const createOrderRating = async (req, res) => {
    try {
        const rating = await createOrderRatingService(req.body, req.user.id);
        return res.status(201).json(rating);
    } catch (error) {
        return handleRatingError(res, error);
    }
};

const listOrderRatings = async (req, res) => {
    try {
        const { dishId, sort } = req.query;
        const result = await listOrderRatingsService({ dishId, sort });
        return res.status(200).json(result);
    } catch (error) {
        return handleRatingError(res, error);
    }
};

const deleteOrderRating = async (req, res) => {
    try {
        const result = await deleteOrderRatingService(req.params.id, req.user.id);
        return res.status(200).json(result);
    } catch (error) {
        return handleRatingError(res, error);
    }
};

module.exports = {
    createOrderRating,
    listOrderRatings,
    deleteOrderRating,
};
