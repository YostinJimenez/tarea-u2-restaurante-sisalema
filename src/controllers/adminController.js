const { createTimeBlockService, listReservationsService } = require('../services/adminService.js');

const createTimeBlock = async (req, res) => {
    if (req.user.rol !== 'ADMIN') {
        return res.status(403).json({ error: "Access denied" });
    }
    const { startTime, endTime } = req.body;
    try {
        const newTimeBlock = await createTimeBlockService(startTime, endTime);
        return res.status(200).json({
            message: "Time block creado exitosamente",
            newTimeBlock
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const listReservations = async (req, res) => {
    if (req.user.rol !== 'ADMIN') {
        return res.status(403).json({ error: "Access denied" });
    }
    try {
        const reservations = await listReservationsService();
        return res.status(200).json({
            message: "Reservations listadas exitosamente",
            reservations
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createTimeBlock,
    listReservations
}
