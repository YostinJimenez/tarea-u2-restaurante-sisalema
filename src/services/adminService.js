const prisma = require("../db/prisma");

const createTimeBlockService = async (startTime, endTime) => {
    const timeBlock = await prisma.timeBlock.create({
        data: {
            startTime: new Date(startTime),
            endTime: new Date(endTime)
        }
    });
    return timeBlock;
}

const listReservationsService = async () => {
    const reservations = await prisma.reservation.findMany({
        include: {
            user: true,
            timeBlock: true
        }
    });
    return reservations;
}

module.exports = {
    createTimeBlockService,
    listReservationsService
}