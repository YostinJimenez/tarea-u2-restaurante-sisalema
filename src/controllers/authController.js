const { registerUser, loginUser } = require("../services/authService.js");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Nombre, correo y contraseña son obligatorios" });
        }
        const user = await registerUser(email, password, name);
        return res.status(201).json({
            message: "Usuario registrado exitosamente",
            user,
        });
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({ error: "El correo ya está registrado" });
        }
        return res.status(error.status || 500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
        }
        const { token, user } = await loginUser(email, password);
        return res.status(200).json({
            message: "Usuario logueado exitosamente",
            token,
            user,
        });
    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message });
    }
};

module.exports = {
    register,
    login,
};
