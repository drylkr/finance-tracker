const express = require("express");
const { getUserProfile } = require("../controllers/userController");
const {
  addFinancialData,
  getUserFinancialData,
  deleteFinancialData,
  updateFinancialData,
} = require("../controllers/financialController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// User profile route
router.get("/profile", verifyToken, getUserProfile);

// Financial data routes
router.post("/data", verifyToken, addFinancialData);
router.get("/data", verifyToken, getUserFinancialData);
router.put("/data/:id", verifyToken, updateFinancialData);
router.delete("/data/:id", verifyToken, deleteFinancialData);

module.exports = router;
