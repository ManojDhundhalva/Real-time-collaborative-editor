const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Import Routes
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/login", loginRoutes);
app.use("/register", registerRoutes);

// Start Server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
