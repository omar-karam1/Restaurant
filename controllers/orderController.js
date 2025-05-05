const path = require('path');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const User = require('../models/User');

exports.createFromCart = async (req, res) => {
  try {
    const { address, paymentMethod } = req.body;
    const userId = req.session.userId;
    const cart = req.session.cart;

    if (!userId) {
      return res.status(401).send('Unauthorized: Please log in');
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).send('Cart is empty');
    }

    const orderItems = await Promise.all(cart.items.map(async item => {
      const orderItem = new OrderItem({
        product: item.productId || item.product._id,
        quantity: item.quantity,
        price: item.price
      });
      await orderItem.save();
      return orderItem._id;
    }));

    const order = new Order({
      user: userId,
      orderItems,
      totalPrice: cart.totalPrice || cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      address,
      paymentMethod,
      status: 'Pending'
    });

    await order.save();
   

    req.session.cart = { items: [] }; // Clear cart

    // Redirect user to product.html
    res.sendFile(path.join(__dirname, '..', 'public', 'product.html'));

  } catch (error) {
    console.error('Error in createFromCart:', error);
    res.status(500).json({
      message: 'حدث خطأ أثناء إنشاء الطلب',
      errorDetails: error.message
    });
  }
};
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email') // اسم وإيميل المستخدم فقط
      .populate({
        path: 'orderItems',
        populate: {
          path: 'product',
          select: 'name price description image'
        }
      });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'فشل في جلب الطلبات', error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId)
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          model: "Product",
        },
      })
      .populate('user', 'name email'); // Populate user details

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'الطلب غير موجود' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: 'تم تحديث حالة الطلب بنجاح', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'حدث خطأ في السيرفر' });
  }
};
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'الطلب غير موجود' });
    }

    res.status(200).json({ message: 'تم حذف الطلب بنجاح' });
  } catch (error) {
    console.error('خطأ أثناء حذف الطلب:', error);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
};
exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .populate('user', 'name email') // معلومات العميل
      .populate({
        path: 'orderItems',
        populate: {
          path: 'product',
          select: 'name price description image'
        }
      }); // معلومات المنتجات

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'لا توجد طلبات لهذا المستخدم' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('خطأ أثناء جلب الطلبات:', error);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
};