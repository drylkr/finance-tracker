const { db } = require("../config/firebase");

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: userDoc.data() });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

module.exports = { getUserProfile };
