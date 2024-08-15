const pool = require("../db");
const queries = require("../queries/register");
const bcrypt = require("bcrypt");
const util = require("util");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

const saltRounds = 10;
const hashAsync = util.promisify(bcrypt.hash);

const createAccount = async (req, resp) => {
  const { firstname, lastname, username, emailid, password } = req.body;

  if (!firstname || !lastname || !username || !emailid || !password) {
    return resp.status(500).json({ message: "REQUEST - Fields are Empty!!" });
  }

  try {
    const results = await pool.query(queries.getUserName, [username, emailid]);
    if (results.rows.length) {
      return resp.status(209).json({ message: "User Already Exist!" });
    }

    const newPassword = await hashAsync(password, saltRounds);

    const uniqueId = uuidv4();
    const createAccountResult = await pool.query(queries.createAccount, [
      uniqueId,
      firstname,
      lastname,
      username,
      emailid,
      newPassword,
    ]);

    resp.status(201).json({ message: "Account Created Successfully!" });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ message: "DATABASE - Internal Server Error" });
  }
};

module.exports = {
  createAccount,
};
