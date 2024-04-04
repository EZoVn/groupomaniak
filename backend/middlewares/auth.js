const jwt = require("jsonwebtoken");
const DB = require("../database");

const extractBearer = (authorization) => {
  if (typeof authorization !== "string") {
    return false;
  }
  const matches = authorization.match(/(bearer)\s+(\S+)/i);
  return matches && matches[2];
};

module.exports = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization && extractBearer(req.headers.authorization);
    const verif = jwt.verify(token, process.env.TOKEN);
    let userId = parseInt(verif.id);
    req.body.user_id = null;

    const connection = await DB();
    const sql = `SELECT * FROM users WHERE id = ?`;
    const [rows] = await connection.execute(sql, [userId]);
    const user = rows[0];
    connection.end();
    // console.log(user);

    if (!user) {
      return res.status(401).json({
        message: "requête non autorisée",
      });
    } else {
      req.body.user_id = user.id;
      req.body.isAdmin = user.isAdmin;
      next();
    }
  } catch (error) {
    return res
      .status(401)
      .json({ message: "la requête est invalide ou non autorisé !", error });
  }
};
