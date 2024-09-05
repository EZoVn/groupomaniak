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

    // const { contentType, contentId } = req.params;
    // console.log(req.params);
    // console.log('contentType, contentId', contentType, contentId);

    // let sql;
    // if (contentType === "comment") {
    //   sql = `SELECT * FROM comments WHERE id = ? AND user_id = ?`;
    // } else if (contentType === "post") {
    //   sql = `SELECT * FROM posts WHERE id = ? AND user_id = ?`;
    // } else {
    //   connection.end();
    //   return res.status(400).json({ message: "Type de contenu invalide" });
    // }
    // const [contentRows] = await connection.execute(sql, [contentId, userId]);
    // console.log(contentRows);
    // const content = contentRows[0];

    // connection.end();

    // if (!content) {
    //   return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce contenu" });
    // }
    req.body.user_id = user.id;
    console.log('next')
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
