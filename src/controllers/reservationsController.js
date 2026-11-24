const { listReservationsService } = require("../services/reservationService.js")

exports.createReservation = async (req, res) => {
    try {
        const reservation = await listReservationsService.
            createReservation(
                req.body);
        res.status(201).json({ reservation });
    } catch (error) {
        res.status(400).json({ error: error.messager })
    }
}

exports.getReservation = async (req, res) => {
    try {
        const reservation = await listReservationsService.getReservation(
            req.params.id,
        );
        if (!reservation) {
            return res.status(404).json({ error: "Reserva no encontrada" })
        }
        res.status(201).json({ reservation });
    } catch (error) {
        res.status(400).json({ error: error.messager })
    }
}

exports.updateReservation = async (req, res) => {
    try {
        const reservation = await listReservationsService.updateReservation(
            req.params.id,
        );
        if (!reservation) {
            return res.status(404).json({ error: "Reserva no encontrada" })
        }
        res.status(201).json({ reservation });
    } catch (error) {
        res.status(400).json({ error: error.messager })
    }
}

exports.deleteReservation = async (req, res) => {
    try {
        const reservation = await listReservationsService.deleteReservation(
            req.params.id,
        );
        if (!reservation) {
            return res.status(404).json({ error: "Reserva no encontrada" })
        }
        res.status(201).json({ reservation });
    } catch (error) {
        res.status(400).json({ error: error.messager })
    }
}