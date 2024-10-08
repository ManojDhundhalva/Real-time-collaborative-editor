const pool = require("../db");
const queries = require("../queries/login");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const util = require("util");
require("dotenv").config();

const compareAsync = util.promisify(bcrypt.compare);

const getAccount = async (req, resp) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return resp.status(500).json({ message: "REQUEST - Fields are Empty!!" });
  }

  try {
    const results = await pool.query(queries.getAccount, [username]);

    if (results.rows.length !== 1) {
      return resp
        .status(202)
        .json({ message: "Username or Email ID doesn't exist." });
    }

    const { id, password: storedPassword } = results.rows[0]; // { old-name : new-name }

    const result = await compareAsync(password, storedPassword);

    if (result) {
      const token = jwt.sign({ id, username }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
      });
      return resp.status(200).json({ token, username });
    } else {
      return resp.status(201).json({ message: "Incorrect Password" });
    }
  } catch (error) {
    console.error(error);
    resp.status(500).json({ message: "DATABASE - Internal Server Error" });
  }
};

module.exports = {
  getAccount,
};
