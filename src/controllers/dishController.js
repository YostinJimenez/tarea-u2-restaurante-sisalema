const {
    createDishService,
    listDishesService,
    getDishByIdService,
    updateDishService,
    deleteDishService,
} = require("../services/dishService");

const handleDishError = (res, error) => {
    if (error.status) {
        return res.status(error.status).json({ error: error.message });
    }
    if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ error: "Datos del plato inválidos", errors });
    }
    if (error.name === "CastError") {
        return res
            .status(400)
            .json({ error: `Valor inválido para ${error.path}: ${error.value}` });
    }
    if (error.code === 11000) {
        return res
            .status(409)
            .json({ error: "Ya existe un plato registrado con ese código único" });
    }
    return res.status(500).json({ error: "Error interno del servidor" });
};

const createDish = async (req, res) => {
    try {
        const dish = await createDishService(req.body);
        return res.status(201).json(dish);
    } catch (error) {
        return handleDishError(res, error);
    }
};

const listDishes = async (req, res) => {
    try {
        const { q, fields, sort, category, excludeAllergen } = req.query;
        const dishes = await listDishesService({
            q,
            fields,
            sort,
            category,
            excludeAllergen,
        });
        return res.status(200).json(dishes);
    } catch (error) {
        return handleDishError(res, error);
    }
};

const getDishById = async (req, res) => {
    try {
        const dish = await getDishByIdService(req.params.id);
        return res.status(200).json(dish.toJSON({ virtuals: true }));
    } catch (error) {
        return handleDishError(res, error);
    }
};

const updateDish = async (req, res) => {
    try {
        const dish = await updateDishService(req.params.id, req.body);
        return res.status(200).json(dish);
    } catch (error) {
        return handleDishError(res, error);
    }
};

const deleteDish = async (req, res) => {
    try {
        const result = await deleteDishService(req.params.id);
        return res.status(200).json(result);
    } catch (error) {
        return handleDishError(res, error);
    }
};

module.exports = {
    createDish,
    listDishes,
    getDishById,
    updateDish,
    deleteDish,
};
