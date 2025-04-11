const { admin, db } = require("../config/firebase");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// User Registration
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    // Check if user already exists
    const existingUser = await admin
      .auth()
      .getUserByEmail(email)
      .catch(() => null);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({ email, password });

    // Store user details in Firestore
    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: userRecord.email,
      emailVerified: userRecord.emailVerified,
      createdAt: userRecord.metadata.creationTime,
      provider: userRecord.providerData[0].providerId,
    });

    res.json({ message: "User registered successfully", user: userRecord });
  } catch (err) {
    res
      .status(500)
      .json({ error: "User registration failed", details: err.message });
  }
};

// User Login
const loginUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    const userRecord = await admin.auth().getUserByEmail(email);

    const token = jwt.sign(
      { uid: userRecord.uid, email: userRecord.email },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Invalid credentials", details: err.message });
  }
};

module.exports = { registerUser, loginUser };
