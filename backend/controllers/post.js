const DB = require("../database");
// const fs = require("fs");
const Post = require("../models/post");

exports.createPost = async (req, res, next) => {
  const { userId, content, imgUrl } = req.body;
  if (!userId || !content) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const connection = await DB();
    if (req.file) {
      const post = new Post(
        userId,
        content,
        `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      );
      const sql = `INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)`;
      await connection.execute(sql, [post.userId, post.content, post.imgUrl]);
      connection.end();
      return res.status(201).json({ message: "Post created" });
    }
    if (!req.file) {
      const post = new Post(userId, content);
      const sql = `INSERT INTO posts (user_id, content) VALUES (?, ?)`;
      await connection.execute(sql, [post.userId, post.content]);
      connection.end();
      return res.status(201).json({ message: "Post created" });
    }
  } catch (err) {
    res.status(500).json({ message: "Database Error", error: err });
  }
};

exports.getAllPost = async (req, res, next) => {
  try {
    const connection = await DB();
    const sql = `SELECT * FROM posts`;
    const [rows] = await connection.execute(sql);
    connection.end();
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: "Database Error", error: err });
  }
};
exports.getOnePost = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id);
    if (!postId) {
      return res.status(404).json({ message: "ID not found" });
    }
    const connection = await DB();
    const sql = `SELECT * FROM posts WHERE id = ?`;
    const [rows] = await connection.execute(sql, [postId]);
    connection.end();
    return res.status(200).json(rows[0]);
  } catch (err) {
    return res.status(500).json({ message: "Database Error", error: err });
  }
}

exports.getAllPostUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.user_id);
    if (!userId) {
      return res.status(404).json({ message: "ID not found" });
    }
    const connection = await DB();
    const sql = `SELECT * FROM posts WHERE user_id = ?`;
    const [rows] = await connection.execute(sql, [userId]);
    connection.end();
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: "Database Error", error: err });
  }
}