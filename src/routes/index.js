const { Router } = require("express");
const router = Router();
const authRoutes = require("./auth.js");
const adminRoutes = require("./admin.js");
const reservations = require("./reservation.js");
const appoinmentRoutes = require("./appointment.js");
const specialitiesRoutes = require("./specialities.js");
const dishesRoutes = require("./dishes.js");
const ordersRoutes = require("./orders.js");
const ratingsRoutes = require("./ratings.js");

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/specialities", specialitiesRoutes);
router.use("/reservations", reservations);
router.use("/users", appoinmentRoutes);
router.use("/dishes", dishesRoutes);
router.use("/orders", ordersRoutes);
router.use("/ratings", ratingsRoutes);

module.exports = router;
