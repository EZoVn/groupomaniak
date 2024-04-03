const express = require('express');
const router = express.Router();
const authCheck = require('../middlewares/auth');
const userCtrl = require('../controllers/user');
// const auth = require('../controllers/auth');

router.get('/', userCtrl.allUsers);
router.get('/:id', authCheck, userCtrl.oneUser);
router.put('/:id', authCheck, userCtrl.modifyUser);
router.delete('/:id', authCheck, userCtrl.deleteUser);

module.exports = router;