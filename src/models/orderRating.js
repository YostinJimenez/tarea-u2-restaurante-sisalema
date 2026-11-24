const mongoose = require("mongoose");

const orderRatingSchema = new mongoose.Schema(
    {
        orderId: {
            type: Number,
            required: [true, "El identificador del pedido (orderId) es obligatorio"],
            unique: true,
        },
        userId: {
            type: Number,
            required: [true, "El identificador del usuario (userId) es obligatorio"],
        },
        dish: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dish",
            required: [true, "La referencia al plato (dish) es obligatoria"],
        },
        customerName: {
            type: String,
            required: [true, "El nombre del cliente es obligatorio"],
            trim: true,
        },
        serviceType: {
            type: String,
            required: [true, "El tipo de servicio es obligatorio"],
            enum: {
                values: ["MESA", "DOMICILIO"],
                message: "El tipo de servicio '{VALUE}' no es válido",
            },
        },
        rating: {
            type: Number,
            required: [true, "La calificación es obligatoria"],
            min: [1, "La calificación mínima es 1"],
            max: [5, "La calificación máxima es 5"],
        },
        comment: {
            type: String,
            trim: true,
            maxlength: [400, "El comentario no puede superar los 400 caracteres"],
            default: "",
        },
        tags: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

orderRatingSchema.pre("validate", function () {
    if (Array.isArray(this.tags)) {
        this.tags = [
            ...new Set(
                this.tags
                    .map((tag) => (typeof tag === "string" ? tag.trim().toLowerCase() : ""))
                    .filter(Boolean)
            ),
        ];
    }
});

orderRatingSchema.index({ dish: 1, createdAt: -1 });

module.exports = mongoose.model("OrderRating", orderRatingSchema);
