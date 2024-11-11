const express = require("express");
const cors = require("cors");
const http = require("http");
const cookieParser = require("cookie-parser");
const config = require("./config");
const initIO = require("./config/socket");
const corsConfig = require("./config/cors");
const socketHandlers = require("./socket/socketHandlers");

const app = express();
const server = http.createServer(app);

const io = initIO(server);
socketHandlers(io);

// Import Routes
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const projectRoutes = require("./routes/project");
const userRoutes = require("./routes/user");

// Middleware
app.use(cors(corsConfig));
app.use(cookieParser());
app.use(express.json());

// Routes
app.get("/", (_, res) => res.send("Hello, World!"));

app.use("/login", loginRoutes);
app.use("/register", registerRoutes);
app.use("/project", projectRoutes);
app.use("/user", userRoutes);

// Start Server
server.listen(config.PORT, () => console.log(`App listening on port ${config.PORT}`));
