const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// إنشاء مستخدم
router.post('/', UserController.createUser);

// عرض كل المستخدمين
router.get('/', UserController.getAllUsers);

// عرض مستخدم معين
router.get('/:id', UserController.getUserById);

// تحديث بيانات مستخدم
router.put('/:id', UserController.updateUser);

// حذف مستخدم
router.delete('/:id', UserController.deleteUser);
router.post('/login', UserController.login);


module.exports = router;
