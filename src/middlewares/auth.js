require("dotenv").config();
// El paquete json web token es para crear tokens
// npm install jsonwebtoken
const jwt = require("jsonwebtoken");
// npm install bcryptjs es para encriptar y desencriptar contraseñas
const bcryptjs = require("bcryptjs");

// Lo que hace el jxt en un login 

function authenticateToken(req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token invalido" });
        }
        req.user = user;
        next();
    });

}

module.exports = authenticateToken;
// Lo jwt se dividen en 3 partes principales (pero se applica 3 puntos en el token):
// 1. Header: Contiene metadatos sobre el token.
// 2. Payload: Contiene la informacion del usuario.
// 3. Signature: Contiene la firma digital del token.
