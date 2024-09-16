const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const pool = require("./db");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

// Import Routes
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const projectRoutes = require("./routes/project");

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
app.use("/project", projectRoutes);

// Query to insert live users
const insertLiveUser = async (fileId, username) => {
  if (!username || !fileId) {
    return;
  }
  try {
    const results = await pool.query(
      "SELECT * FROM live_users WHERE file_id = $1 AND username = $2",
      [fileId, username]
    );

    await pool.query(
      "UPDATE live_users SET is_active_in_tab = FALSE WHERE username = $1",
      [username]
    );
    if (results.rows.length) {
      try {
        await pool.query(
          "UPDATE live_users SET is_active_in_tab = TRUE, is_live = TRUE, live_users_timestamp = CURRENT_TIMESTAMP WHERE file_id = $1 AND username = $2",
          [fileId, username]
        );
      } catch (err) {
        console.error("Error updating live user:", err);
        throw err;
      }
    } else {
      try {
        await pool.query(
          "INSERT INTO live_users (file_id, username, is_active_in_tab, is_live, live_users_timestamp) VALUES ($1, $2, TRUE, TRUE, CURRENT_TIMESTAMP) ON CONFLICT (file_id, username) DO NOTHING;",
          [fileId, username]
        );
      } catch (err) {
        console.error("Error inserting live user:", err);
        throw err;
      }
    }
  } catch (err) {
    console.error("Error getting live user:", err);
    throw err;
  }
};

// Query to remove live users
const removeLiveUser = async (fileId, username) => {
  const query = "DELETE FROM live_users WHERE file_id = $1 AND username = $2;";
  await pool.query(query, [fileId, username]);
};

const removeActiveLiveUser = async (username) => {
  const query = `UPDATE live_users SET is_live = FALSE WHERE username = $1;`;
  await pool.query(query, [username]);
};

// Query to get live users in a file
const getLiveUsersInFile = async (fileId, username) => {
  const query = `SELECT f.*, lu.*, f.file_id AS id FROM files AS f LEFT JOIN live_users AS lu ON f.file_id = lu.file_id WHERE lu.file_id = $1 AND lu.username = $2;`; //f.project_id = $1;
  const res = await pool.query(query, [fileId, username]);
  return res.rows;
};

io.on("connection", (socket) => {
  console.log("id -", socket.id);

  socket.on("joinFile", async ({ username, file_id }) => {
    console.log("username", username);

    // socket.join(file_id);
    await insertLiveUser(file_id, username);

    const person = await getLiveUsersInFile(file_id, username);
    io.emit("userJoined", { person });
    // socket.broadcast.to(fileId).emit("userJoined", { person });

    // socket.currentFile = file_id;
    socket.username = username;

    socket.on("get-document", async ({ file_id }) => {
      const data = await getData(file_id);
      socket.emit("load-document", { data, file_id });
    });

    socket.on("send-changes", ({ delta, file_id }) => {
      console.log("delta", delta);
      socket.broadcast.emit("receive-changes", { delta, file_id });
    });
  });

  socket.on("leaveFile", async ({ file_id, username }) => {
    console.log("leave", file_id, username);
    if (!file_id || !username) {
      return;
    }
    await removeLiveUser(file_id, username);
    io.emit("userLeft", { file_id, username });
    // socket.broadcast.to(file).emit("userLeft", { file_id, username });
    // socket.leave(file_id);
  });

  socket.on("disconnect", async () => {
    if (socket.currentFile && socket.username) {
      console.log(socket);
      await removeActiveLiveUser(socket.username); //depened on currntfile
      io.emit("userLeft-live", { username: socket.username });
      // socket.broadcast.to(socket.currentFile).emit("userLeft-live", {
      //   file_id: socket.currentFile,
      //   username: socket.username,
      // });
    }
  });
});

// Start Server
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

const getData = async (fileId) => {
  if (!fileId) {
    return;
  }
  try {
    const results = await pool.query(
      "SELECT file_data FROM files WHERE file_id = $1",
      [fileId]
    );
    console.log("file_data -->", results.rows[0].file_data);
    return results.rows[0].file_data;
  } catch (err) {
    console.log("Error -> ", err);
  }
  return "";
};
