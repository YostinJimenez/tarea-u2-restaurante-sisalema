const mongoose = require("mongoose");

const connectMongo = async () => {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
        throw new Error("La variable de entorno MONGODB_URI no está definida");
    }
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
};

module.exports = { connectMongo };
