const DB = require("../database");
const bcrypt = require("bcrypt");

exports.allUsers = async (req, res) => {
  try {
    const connection = await DB();
    const sql = `SELECT id, username, email FROM users`; // Modify the SQL query to select only id, username, and email
    const [result] = await connection.execute(sql);
    connection.end();
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ message: "Database Error", error: err });
  }
}

exports.oneUser = async (req, res) => {
  try {
    const connection = await DB();
    const sql = `SELECT id, username, email FROM users WHERE id = ?`;
    const [result] = await connection.execute(sql, [req.params.id]);
    connection.end();
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ message: "Database Error", error: err });
  }
};

exports.modifyUser = async (req, res) => {
  let userId = parseInt(req.params.id);
  console.log(userId);
  if (!userId) {
    return res.status(400).json({ message: `ID introuvable` });
  }
  console.log(req.body.password);
  try {
    let hash = '';
    if (req.body.password && req.body.password !== '') {
      hash = await bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALT_ROUND));
    }
    const connection = await DB();
    const sql = `UPDATE users SET password = ? WHERE id = ?`;
    await connection.execute(sql, [hash, userId]);
    connection.end();
    res.status(200).json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ message: "Database Error", error: err });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const connection = await DB();
    const sql = `DELETE FROM users WHERE id = ?`;
    await connection.execute(sql, [req.params.id]);
    connection.end();
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Database Error", error: err });
  }
};
