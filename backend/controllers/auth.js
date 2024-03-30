const bcrypt = require("bcrypt");
const User = require("../models/User");
const DB = require("../database");

// Fonction de connexion (login)
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Mauvais email ou mot de passe" });
  }
  try {
    const connection = await DB();
    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await connection.execute(sql, [email]);
    console.log(rows);
    await connection.end();
    if (rows.length === 0) {
      return res.status(401).json({ error: "Cet utilisateur n'existe pas" });
    }
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }
    res.status(200).json({ message: "Connexion réussie", data: user });

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
      await connection.end();
      return res.status(409).json({ error: "Cet utilisateur existe déjà" });
    }

    // Création de l'utilisateur avec hash du mot de passe
    const newUser = await User.beforeCreate(username, email, password);

    // Ajout de l'utilisateur à la base de données
    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    await connection.execute(sql, [newUser.username, newUser.email, newUser.password]);
    await connection.end();
    res.status(201).json({ message: "Utilisateur créé", data: newUser });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ error: "Erreur lors de l'inscription" });
  }
};
