const mongoose = require("mongoose");
const prisma = require("../db/prisma");
const Dish = require("../models/dish");

const DELIVERY_FEE_CENTS = 250; // $2.50 fixed delivery fee
const VALID_SERVICE_TYPES = ["MESA", "DOMICILIO"];

const createOrderService = async (data, userId) => {
    const {
        dishId,
        serviceType = "MESA",
        tableNumber,
        deliveryAddress,
        quantity = 1,
    } = data;

    if (!dishId || !mongoose.isValidObjectId(dishId)) {
        const error = new Error(
            "El identificador del plato (dishId) es obligatorio y debe ser un ObjectId válido"
        );
        error.status = 400;
        throw error;
    }

    const normalizedServiceType = String(serviceType).trim().toUpperCase();
    if (!VALID_SERVICE_TYPES.includes(normalizedServiceType)) {
        const error = new Error(
            "El tipo de servicio debe ser MESA o DOMICILIO"
        );
        error.status = 400;
        throw error;
    }

    const parsedQuantity = Number(quantity);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1 || parsedQuantity > 50) {
        const error = new Error(
            "La cantidad debe ser un número entero entre 1 y 50"
        );
        error.status = 400;
        throw error;
    }

    let parsedTableNumber = null;
    let normalizedAddress = null;

    if (normalizedServiceType === "MESA") {
        parsedTableNumber = Number(tableNumber);
        if (!Number.isInteger(parsedTableNumber) || parsedTableNumber < 1) {
            const error = new Error(
                "Para servicio en MESA debes indicar un número de mesa válido (tableNumber)"
            );
            error.status = 400;
            throw error;
        }
    } else {
        normalizedAddress = typeof deliveryAddress === "string" ? deliveryAddress.trim() : "";
        if (normalizedAddress.length < 5) {
            const error = new Error(
                "Para servicio a DOMICILIO debes indicar una dirección de entrega válida"
            );
            error.status = 400;
            throw error;
        }
    }

    // Validate cross-database reference in MongoDB using exists + fetch current price
    const dishExists = await Dish.exists({ _id: dishId });
    if (!dishExists) {
        const error = new Error("El plato especificado no existe en el catálogo");
        error.status = 404;
        throw error;
    }

    const dish = await Dish.findById(dishId).select("name code category price available");
    if (!dish.available) {
        const error = new Error("El plato seleccionado no está disponible en el menú actual");
        error.status = 400;
        throw error;
    }

    // Exact decimal arithmetic in cents to avoid floating-point inaccuracies
    const unitPriceCents = Math.round(dish.price * 100);
    const deliveryFeeCents =
        normalizedServiceType === "DOMICILIO" ? DELIVERY_FEE_CENTS : 0;
    const totalCents = unitPriceCents * parsedQuantity + deliveryFeeCents;

    const order = await prisma.order.create({
        data: {
            userId,
            dishId: dish._id.toString(),
            serviceType: normalizedServiceType,
            tableNumber: parsedTableNumber,
            deliveryAddress: normalizedAddress,
            quantity: parsedQuantity,
            unitPrice: (unitPriceCents / 100).toFixed(2),
            deliveryFee: (deliveryFeeCents / 100).toFixed(2),
            total: (totalCents / 100).toFixed(2),
        },
        include: {
            user: {
                select: { id: true, name: true, email: true },
            },
        },
    });

    return {
        ...order,
        dish: {
            _id: dish._id,
            name: dish.name,
            code: dish.code,
            category: dish.category,
            price: dish.price,
        },
    };
};

// Cross-database join using $in + Map (2 queries total, zero N+1)
const listOrdersWithDishService = async (userId) => {
    const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: { id: true, name: true, email: true },
            },
        },
    });

    const uniqueDishIds = [
        ...new Set(
            orders
                .map((order) => order.dishId)
                .filter((id) => id && mongoose.isValidObjectId(id))
        ),
    ];

    const dishes =
        uniqueDishIds.length > 0
            ? await Dish.find({ _id: { $in: uniqueDishIds } })
                  .select("name code category price ingredients allergens available")
                  .lean()
            : [];

    const dishMap = new Map(dishes.map((dish) => [dish._id.toString(), dish]));

    return orders.map((order) => ({
        ...order,
        dish: order.dishId ? dishMap.get(order.dishId) || null : null,
    }));
};

const getOrderByIdService = async (orderId, userId) => {
    const parsedId = Number(orderId);
    if (!Number.isInteger(parsedId) || parsedId < 1) {
        const error = new Error("El identificador del pedido debe ser un número entero positivo");
        error.status = 400;
        throw error;
    }

    const order = await prisma.order.findUnique({
        where: { id: parsedId },
        include: {
            user: {
                select: { id: true, name: true, email: true },
            },
        },
    });

    if (!order) {
        const error = new Error("Pedido no encontrado");
        error.status = 404;
        throw error;
    }

    if (order.userId !== userId) {
        const error = new Error("No tienes permiso para acceder a este pedido");
        error.status = 403;
        throw error;
    }

    const dish =
        order.dishId && mongoose.isValidObjectId(order.dishId)
            ? await Dish.findById(order.dishId)
                  .select("name code category price ingredients allergens")
                  .lean()
            : null;

    return {
        ...order,
        dish,
    };
};

const deleteOrderService = async (orderId, userId) => {
    const parsedId = Number(orderId);
    if (!Number.isInteger(parsedId) || parsedId < 1) {
        const error = new Error("El identificador del pedido debe ser un número entero positivo");
        error.status = 400;
        throw error;
    }

    const order = await prisma.order.findUnique({
        where: { id: parsedId },
    });

    if (!order) {
        const error = new Error("Pedido no encontrado");
        error.status = 404;
        throw error;
    }

    if (order.userId !== userId) {
        const error = new Error("No tienes permiso para eliminar un pedido de otro usuario");
        error.status = 403;
        throw error;
    }

    await prisma.order.delete({ where: { id: parsedId } });

    return {
        message: "Pedido eliminado correctamente",
        deletedOrderId: parsedId,
    };
};

module.exports = {
    createOrderService,
    listOrdersWithDishService,
    getOrderByIdService,
    deleteOrderService,
};
