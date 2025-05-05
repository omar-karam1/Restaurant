const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// إضافة منتج إلى العربة
router.post('/add', cartController.addToCart);

// عرض محتويات العربة
router.get('/view', cartController.viewCart);

// تحديث كمية منتج في العربة
router.put('/update/:productId', cartController.updateCartItem);

// حذف منتج من العربة
router.delete('/remove/:productId', cartController.removeFromCart);

module.exports = router;