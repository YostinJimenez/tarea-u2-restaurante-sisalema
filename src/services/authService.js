const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../db/prisma.js");

const registerUser = async (email, password, name) => {
    const hashPassword = await bcryptjs.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashPassword,
            role: "USER",
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
    return newUser;
};

const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        const error = new Error("Credenciales inválidas");
        error.status = 401;
        throw error;
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
        const error = new Error("Credenciales inválidas");
        error.status = 401;
        throw error;
    }
    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};

module.exports = {
    registerUser,
    loginUser,
};
