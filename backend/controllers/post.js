const DB = require("../database");
const fs = require("fs");
const Post = require("../models/post");

exports.createPost = async (req, res, next) => {
  const { userId, content, imgUrl } = req.body;
  if (!userId || !content) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const connection = await DB();
    if (req.file) {
      let imgUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
      const post = new Post(userId, content, imgUrl);
      const sql = `INSERT INTO posts (user_id, content, imgUrl) VALUES (?, ?, ?)`;
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
    // const sql = `SELECT * FROM posts`;
    const sql = `
    SELECT 
      posts.id AS post_id,
      posts.content AS post_content,
      posts.imgUrl AS post_imgUrl,
      posts.created_at AS post_created_at,
      users.id AS user_id,
      users.username AS username,
      users.imgUser AS user_imgUser,
      comments.id AS comment_id,
      comments.user_id AS comment_user_id,
      comments.post_id AS comment_post_id,
      comments.content AS comment_content,
      comments.created_at AS comment_created_at
    FROM 
        posts
    LEFT JOIN 
        users ON posts.user_id = users.id
    LEFT JOIN 
        comments ON posts.id = comments.post_id
    ORDER BY 
      posts.created_at DESC, comments.created_at ASC;
    `;
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
};

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
};

exports.deletePost = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id);
    if (!postId) {
      return res.status(404).json({ message: "ID not found" });
    }
    const connection = await DB();
    const sql = `SELECT * FROM posts WHERE id = ?`;
    const [rows] = await connection.execute(sql, [postId]);
    const post = rows[0];
    if (!post.imgUrl) {
      const sql = `DELETE FROM posts WHERE id = ?`;
      await connection.execute(sql, [postId]);
      connection.end();
      return res.status(200).json({ message: "Post deleted without imgUrl" });
    }
    const filename = post.imgUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, async () => {
      const sql = `DELETE FROM posts WHERE id = ?`;
      await connection.execute(sql, [postId]);
      connection.end();
      return res.status(200).json({ message: "Post deleted with imgUrl" });
    });
  } catch (err) {
    return res.status(500).json({ message: "Database Error", error: err });
  }
};

exports.modifyPost = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id);
    const { userId, content, imgUrl } = req.body;
    if (!postId) {
      return res.status(404).json({ message: "ID not found" });
    }
    const connection = await DB();
    const sql = `SELECT * FROM posts WHERE id = ?`;
    const [rows] = await connection.execute(sql, [postId]);
    const post = rows[0];
    if (req.file) {
      console.log(post);
      if (post.imgUrl !== null) {
        const ancienneImage = post.imgUrl.split("/images/")[1];
        fs.unlink(`images/${ancienneImage}`, (error) => {
          if (error) console.log(error);
          else {
            console.log("Ancienne image effacé " + ancienneImage);
          }
        });
        let imgUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
        const sql = `UPDATE posts SET user_id = ?, content = ?, imgUrl = ? WHERE id = ?`;
        await connection.execute(sql, [userId, content, imgUrl, postId]);
        console.log("Post modified", imgUrl);
        connection.end();
        return res.status(200).json({ message: "Post modified" });
      }
    }
    if (!req.file) {
      console.log("!req.file", post.imgUrl);
      const sql = `UPDATE posts SET user_id = ?, content = ? WHERE id = ?`;
      await connection.execute(sql, [userId, content, postId]);
      connection.end();
      return res.status(200).json({ message: "Post modified" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Database Error", error: err });
  }
};
