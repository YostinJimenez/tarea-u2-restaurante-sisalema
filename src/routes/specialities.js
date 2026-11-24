const { Router } = require("express");
const { createSpeciality, ListSpeciality, getSpeciality, updateSpeciality, deleteSpeciality } = require("../controllers/specialityController.js");
// const authenticateToken = require("../middlewares/admin.js");
const router = Router();

router.post('/', createSpeciality);
router.get('/', ListSpeciality);
router.get('/:id', getSpeciality);
router.patch("/:id", updateSpeciality);
router.delete("/area/:area", deleteSpeciality);

module.exports = router;