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
    const token = req.headers.authorization && extractBearer(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const verif = jwt.verify(token, process.env.TOKEN);
    const userId = parseInt(verif.id);

    const connection = await DB();

    const sqlUser = `SELECT * FROM users WHERE id = ?`;
    const [rows] = await connection.execute(sqlUser, [userId]);
    const user = rows[0];

    if (!user) {
      connection.end();
      return res.status(401).json({
        message: "Utilisateur non autorisée",
      });
    }

    if (user.role === 'admin') {
      req.body.user_id = user.id;
      return next();
    }
    req.body.user_id = user.id;
    next();

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
