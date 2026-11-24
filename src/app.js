const express = require("express");
const app = express();
const routes = require("./routes/index.js");

app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
    res.send("<h1>Bienvenido a la API</h1>");
})

module.exports = app;