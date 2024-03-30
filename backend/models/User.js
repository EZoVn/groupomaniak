const db = require("../database");
const bcrypt = require("bcrypt");

class User {
  constructor(username, email, password, role = "user") {
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
  }
  // Hacher le mot de passe
  static async beforeCreate(username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new User(username, email, hashedPassword);
  }
}
module.exports = User;
