const Speciality = require("../models/speciality");

const UPDATE_FIELDS = [
    "name",
    "code",
    "description",
    "area",
    "durationMinutes",
    "contactEmail",
    "info",
    "label",
];

const createSpecialityService = async (data) => {
    return await Speciality.create(data);
};

const ListSpecialityService = async () => {
    return await Speciality.find();
};

const getSpecialityService = async (id) => {
    return await Speciality.findById(id);
};

const updateSpecialityService = async (id, data = {}) => {
    const speciality = await Speciality.findById(id);
    if (!speciality) {
        return null;
    }
    for (const field of UPDATE_FIELDS) {
        if (data[field] !== undefined) {
            speciality.set(field, data[field]);
        }
    }

    return speciality.save();

};

const deleteSpecialityService = async (id) => {
    return await Speciality.findByIdAndDelete(id);
};

module.exports = {
    createSpecialityService, ListSpecialityService, getSpecialityService, updateSpecialityService,
    deleteSpecialityService
};