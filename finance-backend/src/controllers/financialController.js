const { db } = require("../config/firebase");

// Add financial data
const addFinancialData = async (req, res) => {
  try {
    const { type, category, amount, date, notes } = req.body;

    if (!type || !category || !amount || !date) {
      return res
        .status(400)
        .json({ error: "Type, category, amount, and date are required." });
    }

    // Validate type
    if (!["Income", "Expense", "Investment"].includes(type)) {
      return res
        .status(400)
        .json({ error: "Type must be 'Income', 'Expense', or 'Investment'." });
    }

    // Validate date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    const financialData = {
      userId: req.user.uid,
      type,
      category,
      amount,
      date: parsedDate.toISOString(),
      notes: notes || "",
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("financialData").add(financialData);
    
    res.status(201).json({ 
      id: docRef.id, 
      ...financialData 
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add financial data", details: error.message });
  }
};

// Get user's financial data
const getUserFinancialData = async (req, res) => {
  try {
    const snapshot = await db
      .collection("financialData")
      .where("userId", "==", req.user.uid)
      .get();

    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ financialData: data });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch financial data",
      details: error.message,
    });
  }
};

// Delete financial data
const deleteFinancialData = async (req, res) => {
  try {
    const docId = req.params.id;
    const docRef = db.collection("financialData").doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Financial data not found" });
    }

    if (doc.data().userId !== req.user.uid) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await docRef.delete();
    res.json({ message: "Financial data deleted successfully" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete financial data",
      details: error.message,
    });
  }
};

// Update financial data
const updateFinancialData = async (req, res) => {
  try {
    const docId = req.params.id;
    const { type, category, amount, date, notes } = req.body;

    // Check if financial data exists
    const docRef = db.collection("financialData").doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Financial data not found" });
    }

    if (doc.data().userId !== req.user.uid) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Validate type
    if (type && !["Income", "Expense", "Investment"].includes(type)) {
      return res
        .status(400)
        .json({ error: "Type must be 'income', 'expense', or 'investment'." });
    }

    // Validate amount (must be a positive number)
    if (amount !== undefined && (isNaN(amount) || amount <= 0)) {
      return res
        .status(400)
        .json({ error: "Amount must be a positive number." });
    }

    // Prepare updated fields
    const updatedData = {
      ...(type && { type }),
      ...(category && { category }),
      ...(amount !== undefined && { amount }),
      ...(date && { date }),
      ...(notes !== undefined && { notes }),
      updatedAt: new Date().toISOString(),
    };

    await docRef.update(updatedData);
    res.json({ message: "Financial data updated successfully" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update financial data",
      details: error.message,
    });
  }
};

module.exports = {
  addFinancialData,
  getUserFinancialData,
  deleteFinancialData,
  updateFinancialData,
};
