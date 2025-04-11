require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");  // Required for path handling
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// Serve static files from the frontend dist folder
app.use(express.static(path.join(__dirname, '../finance-frontend', 'dist')));

// Catch-all route to serve index.html for all other routes (frontend routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../finance-frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
