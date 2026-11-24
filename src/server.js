require("dotenv").config();
const app = require("./app.js");
const { connectMongo } = require("./db/mongo.js");
const PORT = process.env.PORT || 3000;

connectMongo()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`El servidor está corriendo en el puerto http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error al conectar a MongoDB", error);
        process.exit(1);
    });

