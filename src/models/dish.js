const mongoose = require("mongoose");
const slugify = require("slugify");

const dishSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "El nombre del plato es obligatorio"],
            trim: true,
            minlength: [3, "El nombre del plato debe tener al menos 3 caracteres"],
            maxlength: [80, "El nombre del plato no puede superar los 80 caracteres"],
        },
        code: {
            type: String,
            required: [true, "El código del plato es obligatorio"],
            unique: true,
            trim: true,
            uppercase: true,
            match: [/^[A-Z]{3}-\d{2}$/, "El código debe tener el formato PLT-01"],
            validate: {
                validator: async function (value) {
                    const existing = await mongoose.models.Dish.findOne({ code: value });
                    return !existing || existing._id.equals(this._id);
                },
                message: (props) => `Ya existe un plato con el código "${props.value}"`,
            },
        },
        slug: {
            type: String,
            required: [true, "El slug es obligatorio"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "La descripción del plato es obligatoria"],
            trim: true,
            minlength: [20, "La descripción debe tener al menos 20 caracteres"],
            maxlength: [300, "La descripción no puede superar los 300 caracteres"],
        },
        category: {
            type: String,
            required: [true, "La categoría del plato es obligatoria"],
            enum: {
                values: ["entrada", "plato_fuerte", "postre", "bebida"],
                message:
                    "La categoría '{VALUE}' no es válida. Valores permitidos: entrada, plato_fuerte, postre, bebida",
            },
        },
        price: {
            type: Number,
            required: [true, "El precio del plato es obligatorio"],
            min: [1, "El precio mínimo permitido es 1.00"],
            max: [500, "El precio máximo permitido es 500.00"],
            validate: {
                validator: (value) =>
                    typeof value === "number" &&
                    Number.isFinite(value) &&
                    Math.abs(value * 100 - Math.round(value * 100)) < 1e-6,
                message: "El precio debe tener como máximo dos decimales",
            },
        },
        prepMinutes: {
            type: Number,
            default: 20,
            min: [5, "El tiempo mínimo de preparación es de 5 minutos"],
            max: [180, "El tiempo máximo de preparación es de 180 minutos"],
        },
        ingredients: {
            type: [String],
            required: [true, "Los ingredientes son obligatorios"],
            validate: {
                validator: (arr) =>
                    Array.isArray(arr) &&
                    arr.length >= 2 &&
                    arr.every((item) => typeof item === "string" && item.trim().length > 0),
                message: "El plato debe incluir al menos 2 ingredientes válidos",
            },
        },
        allergens: {
            type: [String],
            default: [],
        },
        weeklyMenu: {
            type: String,
            default: "menu-actual",
            trim: true,
        },
        available: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

dishSchema.virtual("menuSummary").get(function () {
    const formattedPrice =
        typeof this.price === "number" ? this.price.toFixed(2) : "0.00";
    return `${this.name} (${this.code}) - $${formattedPrice} [${this.category}]`;
});

dishSchema.pre("validate", function () {
    if (this.name) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    if (this.code) {
        this.code = this.code.trim().toUpperCase();
    }
    if (Array.isArray(this.ingredients)) {
        this.ingredients = this.ingredients
            .map((item) => (typeof item === "string" ? item.trim() : ""))
            .filter(Boolean);
    }
    if (Array.isArray(this.allergens)) {
        this.allergens = [
            ...new Set(
                this.allergens
                    .map((item) => (typeof item === "string" ? item.trim().toLowerCase() : ""))
                    .filter(Boolean)
            ),
        ];
    }
});

dishSchema.index({ category: 1, available: 1 });

module.exports = mongoose.model("Dish", dishSchema);
