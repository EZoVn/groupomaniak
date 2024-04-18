const express = require('express');
const commentCtrl = require('../controllers/comment');
const authCheck = require('../middlewares/auth');

const router = express.Router();

router.post('/:post_id', commentCtrl.createComment);
router.get('/post/:post_id', commentCtrl.getAllCommentsPost);
router.get('/:id', commentCtrl.getOneComment);
router.put('/:id', commentCtrl.modifyComment);
router.delete('/:id', commentCtrl.deleteComment);

module.exports = router;