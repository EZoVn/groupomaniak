const express = require('express');
const router = express.Router();
const authCheck = require('../middlewares/auth');
const postCtrl = require('../controllers/post');

router.post('/', authCheck, postCtrl.createPost);
router.get('/', authCheck, postCtrl.getAllPost);
router.get('/:id', authCheck, postCtrl.getOnePost);
router.get('/postsUser/:user_id', authCheck, postCtrl.getAllPostUser);

module.exports = router;