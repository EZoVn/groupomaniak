const jwt = require("jsonwebtoken");
const DB = require("../database");

const extractBearer = (authorization) => {
  if (typeof authorization !== "string") {
    return false;
  }
  const matches = authorization.match(/(bearer)\s+(\S+)/i);
  // console.log(matches);
  return matches && matches[2];
};

module.exports = async (req, res, next) => {
  try {
    // console.log("Authorization header:", req.headers.authorization);
    const token = req.headers.authorization && extractBearer(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }
    const verif = jwt.verify(token, process.env.TOKEN);
    let userId = parseInt(verif.id);
    req.body.user_id = null;

    const connection = await DB();
    const sql = `SELECT * FROM users WHERE id = ?`;
    const [rows] = await connection.execute(sql, [userId]);
    const user = rows[0];
    connection.end();

    if (!user) {
      return res.status(401).json({
        message: "requête non autorisée",
      });
    } else {
      req.body.user_id = user.id;
      // req.body.isAdmin = user.isAdmin;
      next();
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "le token est expire", error });
    }
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "le token est invalide", error });
    }
    return res
      .status(500)
      .json({ message: "Erreur serveur", error });
  }
};
