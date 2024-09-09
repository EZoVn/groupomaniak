const DB = require("../database");
const Comment = require("../models/Comment");

exports.createComment = async (req, res, next) => {
  const { userId, content } = req.body;
  const postId = parseInt(req.params.post_id);
  if (!userId || !content) {
    return res.status(400).json({ message: "Aucun champ ne doit être vide" });
  }
  try {
    const connection = await DB();
    const comment = new Comment(userId, postId, content);
    const sql = `INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)`;
    await connection.execute(sql, [
      comment.userId,
      comment.postId,
      comment.content,
    ]);
    connection.end();
    return res.status(201).json({ message: "Commentaire créé" });
  } catch (err) {
    return res.status(500).json({ message: "Database Error", error: err });
  }
};

exports.getAllCommentsPost = async (req, res, next) => {
  const postId = parseInt(req.params.post_id);
  try {
    const connection = await DB();
    const sql = `SELECT user_id, post_id, content, created_at FROM comments WHERE post_id = ?`;
    const [rows] = await connection.execute(sql, [postId]);
    console.log(rows);
    connection.end();
    return res.status(200).json({ comments: rows });
  } catch (error) {
    return res.status(500).json({ message: "Database Error", error: err });
  }
};

exports.getOneComment = async (req, res, next) => {
  const commentId = parseInt(req.params.id);
  console.log(commentId);
  try {
    const connection = await DB();
    const sql = `SELECT user_id, post_id, content, created_at FROM comments WHERE id = ?`;
    const [rows] = await connection.execute(sql, [commentId]);
    connection.end();
    return res.status(200).json({ comment: rows[0] });
  } catch (error) {
    return res.status(500).json({ message: "Database Error", error: err });
  }
}


exports.deleteComment = async (req, res, next) => {
  const commentId = parseInt(req.params.id);
  const isAdmin = req.body.isAdmin;
  if (!commentId) {
    return res.status(400).json({ message: "Aucun commentaire séléctionner" });
  }
  try {
    const connection = await DB();
    const [comment] = await connection.execute(`SELECT * FROM comments WHERE id = ?`, [commentId]);
    if (!comment) {
      connection.end();
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }
    const user_id = req.body.user_id;
    if (comment[0].user_id === user_id || isAdmin === true) {
      const sql = `DELETE FROM comments WHERE id = ?`;
      await connection.execute(sql, [commentId]);
      connection.end();
      return res.status(200).json({ message: "Commentaire supprimé" });
    } else {
      return res.status(403).json({ message: "Non authentifié" });
    }

  } catch (error) {
    return res.status(500).json({ message: "Database Error", error: err });
  }
}



exports.modifyComment = async (req, res, next) => {
  const commentId = parseInt(req.params.id);
  const { content, user_id, isAdmin } = req.body;
  try {
    const connection = await DB();
    const [comment] = await connection.execute(`SELECT * FROM comments WHERE id = ?`, [commentId]);
    if (!comment) {
      connection.end();
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }
    if (comment[0].user_id === user_id || isAdmin === true) {
      const sql = `UPDATE comments SET content = ? WHERE id = ?`;
      await connection.execute(sql, [content, commentId]);
      connection.end();
      return res.status(200).json({ message: "Commentaire modifié" });
    } else {
      return res.status(403).json({ message: "Non authentifié" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Database Error", error: err.message });
  }
}