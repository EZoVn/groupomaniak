const express = require('express');
const postCtrl = require('../controllers/post');

const authCheck = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const router = express.Router();

router.get('/', authCheck, postCtrl.getAllPost);
router.get('/:id', authCheck, postCtrl.getOnePost);
router.get('/postsUser/:user_id', authCheck, postCtrl.getAllPostUser);
router.post('/', authCheck, multer, postCtrl.createPost);
router.delete('/:id', authCheck, multer, postCtrl.deletePost);
router.put('/:id', authCheck, multer, postCtrl.modifyPost);

module.exports = router;