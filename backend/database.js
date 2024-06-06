const mysql = require("mysql2/promise");
require("dotenv").config();

// Configurer les informations de connexion à la base de données
const DB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USER_DB,
      password: process.env.PASSWORD_DB,
      database: process.env.DATABASE,
      port: process.env.PORT_DB,
    });
    // console.log("Connexion à la base de données établie.");
    return connection;
  } catch (error) {
    console.error("Erreur lors de la connexion à la base de données :", error);
    throw error;
  }
};

module.exports = DB;
