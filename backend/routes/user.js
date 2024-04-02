const express = require('express');
const router = express.Router();
const authCheck = require('../middlewares/auth');
const userCtrl = require('../controllers/user');
// const auth = require('../controllers/auth');

router.get('/', userCtrl.allUsers);
router.get('/:id', authCheck, userCtrl.oneUser);

module.exports = router;