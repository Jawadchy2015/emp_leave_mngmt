const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Employee Leave Management backend is running.");
});

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      message: "Database connected successfully",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database connection error:", error.message);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const result = await pool.query(
      "SELECT id, username, password_hash, role, full_name, email FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    return res.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.full_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during login.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});