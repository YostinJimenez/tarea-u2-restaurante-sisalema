const mongoose = require("mongoose");
const prisma = require("../db/prisma");
const OrderRating = require("../models/orderRating");

const createOrderRatingService = async (data, userId) => {
    const parsedOrderId = Number(data.orderId);
    if (!Number.isInteger(parsedOrderId) || parsedOrderId < 1) {
        const error = new Error(
            "El identificador del pedido (orderId) debe ser un número entero positivo"
        );
        error.status = 400;
        throw error;
    }

    // Validate cross-database reference in PostgreSQL: exists (404) and belongs to token user (403)
    const order = await prisma.order.findUnique({
        where: { id: parsedOrderId },
        include: {
            user: {
                select: { id: true, name: true },
            },
        },
    });

    if (!order) {
        const error = new Error("El pedido especificado no existe en PostgreSQL");
        error.status = 404;
        throw error;
    }

    if (order.userId !== userId) {
        const error = new Error(
            "No tienes permiso para calificar un pedido que pertenece a otro usuario"
        );
        error.status = 403;
        throw error;
    }

    if (!order.dishId || !mongoose.isValidObjectId(order.dishId)) {
        const error = new Error(
            "El pedido no tiene un plato válido asociado en MongoDB"
        );
        error.status = 400;
        throw error;
    }

    const orderRating = new OrderRating({
        orderId: order.id,
        userId, // Always derived from JWT
        dish: order.dishId,
        customerName: order.user.name, // Denormalized copy from PostgreSQL User
        serviceType: order.serviceType, // Denormalized copy from PostgreSQL Order
        rating: data.rating,
        comment: data.comment,
        tags: data.tags,
    });

    return await orderRating.save();
};

const listOrderRatingsService = async ({ dishId, sort } = {}) => {
    const filter = {};
    const matchStage = {};

    if (dishId && dishId.trim()) {
        if (!mongoose.isValidObjectId(dishId.trim())) {
            const error = new Error(`Identificador de plato inválido: ${dishId}`);
            error.status = 400;
            throw error;
        }
        const objectId = new mongoose.Types.ObjectId(dishId.trim());
        filter.dish = objectId;
        matchStage.dish = objectId;
    }

    const sortExpr = sort && sort.trim() ? sort.split(",").join(" ") : "-createdAt";

    const [ratings, statsResult] = await Promise.all([
        OrderRating.find(filter)
            .populate("dish", "name code category price")
            .sort(sortExpr)
            .exec(),
        OrderRating.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: dishId ? "$dish" : null,
                    totalRatings: { $sum: 1 },
                    averageRating: { $avg: "$rating" },
                    sumRatings: { $sum: "$rating" },
                    minRating: { $min: "$rating" },
                    maxRating: { $max: "$rating" },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalRatings: 1,
                    averageRating: { $round: ["$averageRating", 2] },
                    sumRatings: 1,
                    minRating: 1,
                    maxRating: 1,
                },
            },
        ]),
    ]);

    const summary = statsResult[0] || {
        totalRatings: 0,
        averageRating: 0,
        sumRatings: 0,
        minRating: null,
        maxRating: null,
    };

    return { summary, ratings };
};

const deleteOrderRatingService = async (id, userId) => {
    if (!mongoose.isValidObjectId(id)) {
        const error = new Error(`Identificador de calificación inválido: ${id}`);
        error.status = 400;
        throw error;
    }

    const rating = await OrderRating.findById(id);
    if (!rating) {
        const error = new Error("Calificación no encontrada");
        error.status = 404;
        throw error;
    }

    if (rating.userId !== userId) {
        const error = new Error(
            "No tienes permiso para eliminar una calificación de otro usuario"
        );
        error.status = 403;
        throw error;
    }

    await rating.deleteOne();

    return {
        message: "Calificación eliminada correctamente",
        deletedRatingId: id,
    };
};

module.exports = {
    createOrderRatingService,
    listOrderRatingsService,
    deleteOrderRatingService,
};
