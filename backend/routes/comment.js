const express = require('express');
const commentCtrl = require('../controllers/comment');
const authCheck = require('../middlewares/auth');

const router = express.Router();

router.use((req, res, next) => {
  req.params.contentType = 'comment';
  next();
});

router.post('/:post_id', authCheck, commentCtrl.createComment);
router.get('/post/:post_id', authCheck, commentCtrl.getAllCommentsPost);
router.get('/:id', authCheck, commentCtrl.getOneComment);
router.put('/:id', authCheck, commentCtrl.modifyComment);
router.delete('/:id', authCheck, commentCtrl.deleteComment);

module.exports = router;