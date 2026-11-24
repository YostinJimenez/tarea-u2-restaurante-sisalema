const mongoose = require("mongoose");
const Dish = require("../models/dish");
const OrderRating = require("../models/orderRating");
const prisma = require("../db/prisma");

const ALLOWED_UPDATE_FIELDS = [
    "name",
    "code",
    "description",
    "category",
    "price",
    "prepMinutes",
    "ingredients",
    "allergens",
    "weeklyMenu",
    "available",
];

const createDishService = async (data) => {
    const dish = new Dish(data);
    return await dish.save();
};

const listDishesService = async ({ q, fields, sort, category, excludeAllergen } = {}) => {
    const filter = {};

    if (q && q.trim()) {
        const escaped = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escaped, "i");
        filter.$or = [
            { name: regex },
            { description: regex },
            { code: regex },
            { ingredients: regex },
        ];
    }

    if (category && category.trim()) {
        filter.category = category.trim();
    }

    if (excludeAllergen && excludeAllergen.trim()) {
        filter.allergens = { $ne: excludeAllergen.trim().toLowerCase() };
    }

    let query = Dish.find(filter);

    if (fields && fields.trim()) {
        const projection = fields
            .split(",")
            .map((field) => field.trim())
            .filter(Boolean)
            .join(" ");
        if (projection) {
            query = query.select(projection);
        }
    }

    const sortExpr = sort && sort.trim() ? sort.split(",").join(" ") : "-createdAt";
    query = query.sort(sortExpr);

    return await query.exec();
};

const getDishByIdService = async (id) => {
    if (!mongoose.isValidObjectId(id)) {
        const error = new Error(`Identificador de plato inválido: ${id}`);
        error.status = 400;
        throw error;
    }

    const dish = await Dish.findById(id);
    if (!dish) {
        const error = new Error("Plato no encontrado");
        error.status = 404;
        throw error;
    }

    return dish;
};

const updateDishService = async (id, data) => {
    if (!mongoose.isValidObjectId(id)) {
        const error = new Error(`Identificador de plato inválido: ${id}`);
        error.status = 400;
        throw error;
    }

    const dish = await Dish.findById(id);
    if (!dish) {
        const error = new Error("Plato no encontrado");
        error.status = 404;
        throw error;
    }

    for (const field of ALLOWED_UPDATE_FIELDS) {
        if (Object.prototype.hasOwnProperty.call(data, field)) {
            dish[field] = data[field];
        }
    }

    return await dish.save();
};

const deleteDishService = async (id) => {
    if (!mongoose.isValidObjectId(id)) {
        const error = new Error(`Identificador de plato inválido: ${id}`);
        error.status = 400;
        throw error;
    }

    const dish = await Dish.findById(id);
    if (!dish) {
        const error = new Error("Plato no encontrado");
        error.status = 404;
        throw error;
    }

    const ordersUsingDish = await prisma.order.count({
        where: { dishId: id },
    });

    if (ordersUsingDish > 0) {
        const error = new Error(
            `No se puede eliminar el plato porque está asociado a ${ordersUsingDish} pedido(s) en PostgreSQL`
        );
        error.status = 409;
        throw error;
    }

    const cascadeResult = await OrderRating.deleteMany({ dish: dish._id });
    await dish.deleteOne();

    return {
        message: "Plato eliminado correctamente",
        deletedDishId: id,
        deletedRatingsCount: cascadeResult.deletedCount,
    };
};

module.exports = {
    createDishService,
    listDishesService,
    getDishByIdService,
    updateDishService,
    deleteDishService,
};
