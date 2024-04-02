const DB = require("../database");

exports.allUsers = async (req, res) => {
  try {
    const connection = await DB();
    const sql = `SELECT * FROM users`;
    // Verification des parametres de recherche dans la base de données
    const queryParms = [];
    if (req.query.username) {
      sql += ` WHERE username = ?`;
      queryParms.push(`%${req.query.username}%`);
    }
    if (req.query.email) {
      if (!sql.includes("WHERE")) {
        sql += " WHERE";
      } else {
        sql += " AND";
      }
      sql += " email LIKE ?";
      queryParams.push(`%${req.query.email}%`);
    }

    const [rows] = await connection.execute(sql);
    connection.end();
    res.status(200).json({ data: rows });
  } catch (err) {
    res.status(500).json({ message: "Database Error", error: err });
  }
}
exports.oneUser = async (req, res) => {
  try {
    const connection = await DB();
    const sql = `SELECT * FROM users WHERE id = ?`;
    const [rows] = await connection.execute(sql, [req.params.id]);
    connection.end();
    res.status(200).json({ data: rows });
  } catch (err) {
    res.status(500).json({ message: "Database Error", error: err });
  }
};
exports.modifyUser = async (req, res) => {
  try {
    const connection = await DB();
    const sql = `UPDATE users SET username = ?, email = ? WHERE id = ?`;
    await connection.execute(sql, [req.body.username, req.body.email, req.params.id]);
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
