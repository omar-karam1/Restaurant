const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const isAdmin = require('../middlewares/isAdmin'); // استيراد middleware للتحقق من صلاحية الإدمن

// إنشاء طلب من السلة (متاح للمستخدم العادي)
router.post('/create-from-cart', orderController.createFromCart);

// عرض جميع الطلبات (خاص بالإدمن فقط)
router.get('/all', orderController.getAllOrders);

// عرض تفاصيل طلب واحد (خاص بالإدمن فقط)
router.get('/:id', orderController.getOrderById);

// تحديث حالة الطلب (خاص بالإدمن فقط)
router.put('/:orderId/status',  orderController.updateOrderStatus);

// حذف طلب (خاص بالإدمن فقط)
router.delete('/:orderId',orderController.deleteOrder);

// عرض الطلبات الخاصة بمستخدم معيّن (يُفترض أنه متاح للمستخدم العادي لمراجعة طلباته)
router.get('/user/:userId', orderController.getOrdersByUser);

// صفحة الدفع (Checkout)
router.get('/checkout', (req, res) => {
  res.render('checkout', {
    cart: req.session.cart
  });
});

module.exports = router;
