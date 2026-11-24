const prisma = require("../db/prisma");

exports.getUserAppointments = async (userId) => {
    try {
        const appointments = await prisma.appointment.findMany({
            where: {
                userId: parseInt(userId, 10),
            },
            include: {
                timeBlock: true,
            },
        });
        return appointments;
    } catch (error) {
        throw error("Error al obtener el historial de citas");
    }
};