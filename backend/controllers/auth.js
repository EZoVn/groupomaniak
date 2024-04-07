const User = require("../models/User");
const DB = require("../database");
const jwt = require("jsonwebtoken");

// Fonction de connexion (login)
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Mauvais email ou mot de passe" });
  }
  try {
    const connection = await DB();
    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await connection.execute(sql, [email]);
    if (rows.length === 0) {
      connection.end();
      return res.status(401).json({ message: "Cet utilisateur n'existe pas" });
    }
    const user = rows[0];
    const valid = await User.checkPassword(password, user.password);
    if (!valid) {
      connection.end();
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.TOKEN,
      { expiresIn: process.env.TOKEN_DURING },
    );
    console.log(token);
    res.status(200).json({ message: "Connexion réussie", access_token: token, user_id: user.id });
    connection.end();
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
};

// Fonction d'inscription (signup)
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  // Vérifier si l'utilisateur existe déjà
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Veuillez renseigner tous les champs" });
  }
  try {
    const connection = await DB();

    // verifier si l'username et l'email sont déjà utilisés
    const sqlCheck = "SELECT * FROM users WHERE username = ? OR email = ?";
    const [rows] = await connection.execute(sqlCheck, [username, email]);
    if (rows.length > 0) {
      connection.end();
      return res.status(409).json({ error: "Cet utilisateur existe déjà" });
    }

    // Création de l'utilisateur avec hash du mot de passe
    const newUser = await User.beforeCreate(username, email, password);

    // Ajout de l'utilisateur à la base de données
    const sql =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    await connection.execute(sql, [
      newUser.username,
      newUser.email,
      newUser.password,
    ]);
    connection.end();
    res.status(201).json({ message: "Utilisateur créé", data: newUser });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ error: "Erreur lors de l'inscription" });
  }
};
