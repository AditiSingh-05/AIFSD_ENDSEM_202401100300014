const express = require("express");
const {
  createEmployee,
  getEmployees,
  searchEmployees,
  updateEmployee,
  deleteEmployee
} = require("../controllers/employeeController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.route("/").post(createEmployee).get(getEmployees);
router.get("/search", searchEmployees);
router.route("/:id").patch(updateEmployee).delete(deleteEmployee);

module.exports = router;
