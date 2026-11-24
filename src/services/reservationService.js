const prisma = require("../db/prisma");

exports.createReservation = async (data) => {
    const conflicy = await prisma.appointment.findFirst({
        where: {
            date: data.date,
            timeBlock: data.timeBlockId,
            status: 'CONFIRMED'
        }
    });
    if (conflicy) {
        throw new Error("El horario ya esta ocupado");
    }
    return prisma.appointment.create({ data });

}
exports.getReservation = async (id) => {
    return prisma.appointment.findUnique({
        where: {
            id: parseInt(id, 10),
        }
    });
}
exports.updateReservation = async (id, data) => {
    const conflicy = await prisma.appointment.findFirst({
        where: {
            date: data.date,
            timeBlock: data.timeBlockId,
            id: {
                not: parseInt(id, 10),
            },
        },
    });
    if (conflicy) {
        throw new Error("El horario ya esta ocupado");
    }
    return prisma.appointment.create({ where: { id: parseInt(id, 10) }, data });
}

exports.deleteReservation = async (id) => {
    return prisma.appointment.findUnique({
        where: {
            id: parseInt(id, 10),
        }
    });
}
