const { createSpecialityService, ListSpecialityService, getSpecialityService, updateSpecialityService, deleteSpecialityService } = require("../services/specialityService");

const handleError = (res, error) => {
    if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ error: "Datos inválidos", errors });
    }
    if (error.name === "CastError") {
        return res
            .status(400)
            .json({ error: `Valor inválido para ${error.path}: ${error.value}` });
    }
    return res.status(500).json({ error: "Error interno del servidor" });
};

const createSpeciality = async (req, res) => {
    try {
        const speciality = await createSpecialityService(req.body);
        res.status(201).json(speciality);
    } catch (error) {
        handleError(res, error);
    }
};

const ListSpeciality = async (req, res) => {
    try {
        const specialties = await ListSpecialityService();
        res.json(specialties);
    } catch (error) {
        return handleError(res, error);
    }
};

const getSpeciality = async (req, res) => {
    try {
        const specialty = await getSpecialityService(req.params.id);
        if (!specialty) {
            return res.status(404).json({ error: "Especialidad no encontrada" });
        }
        res.json(specialty.toJSON({ virtuals: true }));
    } catch (error) {
        return handleError(res, error);
    }
};

const updateSpeciality = async (req, res) => {
    try {
        const speciality = await updateSpecialityService(req.params.id, req.body);
        if (!speciality) {
            return res.status(404).json({ error: "Especialidad no encontrada" });
        }
        res.json(speciality.toJSON({ virtual: true }));
    } catch (error) {
        return handleError(res, error);
    }
};

const deleteSpeciality = async (req, res) => {
    try {
        const speciality = await deleteSpecialityService(req.params.id);
        if (!speciality) {
            return res.status(404).json({ error: "Especialidad no encontrada" });
        }
        res.json(speciality.toJSON({ virtual: true }));
    } catch (error) {
        return handleError(res, error);
    }
};

module.exports = { createSpeciality, ListSpeciality, getSpeciality, updateSpeciality, deleteSpeciality };