const Product = require('../models/Product');

// إضافة منتج إلى العربة
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // تحقق من وجود المنتج في الطلب
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // تحقق إذا كان المنتج موجودًا في قاعدة البيانات
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // تحقق أن الكمية أكبر من الصفر
    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than zero' });
    }

    // الحصول على العربة من الجلسة أو إنشاء واحدة جديدة إذا لم تكن موجودة
    if (!req.session.cart) {
      req.session.cart = { items: [], totalPrice: 0 };
    }

    // تحقق مما إذا كان المنتج موجودًا بالفعل في العربة
    const existingItemIndex = req.session.cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex !== -1) {
      // تحديث الكمية إذا كان المنتج موجودًا بالفعل في العربة
      req.session.cart.items[existingItemIndex].quantity += quantity;
    } else {
      // إضافة المنتج إلى العربة
      req.session.cart.items.push({
        productId: product._id,
        productName: product.name,
        image: product.image,
        price: product.price,
        quantity: quantity
      });
    }

    // حساب السعر الإجمالي
    req.session.cart.totalPrice = req.session.cart.items.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );

    res.status(200).json({
      message: 'Product added to cart',
      cart: {
        cart: req.session.cart.items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        totalPrice: req.session.cart.totalPrice
      }
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Error adding product to cart', error: error.message });
  }
};

// عرض محتويات العربة
exports.viewCart = (req, res) => {
  try {
    if (!req.session.cart || req.session.cart.items.length === 0) {
      return res.status(200).json({ 
        message: 'Your cart is empty',
        cart: [],
        totalPrice: 0
      });
    }

    res.status(200).json({
      cart: req.session.cart.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      })),
      totalPrice: req.session.cart.totalPrice
    });
  } catch (error) {
    console.error('Error viewing cart:', error);
    res.status(500).json({ message: 'Error viewing cart', error: error.message });
  }
};

// تحديث كمية المنتج في العربة
exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!req.session.cart || req.session.cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Valid quantity is required' });
    }

    const itemIndex = req.session.cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // تحديث الكمية
    req.session.cart.items[itemIndex].quantity = quantity;

    // إعادة حساب السعر الإجمالي
    req.session.cart.totalPrice = req.session.cart.items.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );

    res.status(200).json({
      message: 'Cart updated successfully',
      cart: {
        cart: req.session.cart.items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        totalPrice: req.session.cart.totalPrice
      }
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Error updating cart', error: error.message });
  }
};

// حذف منتج من العربة
exports.removeFromCart = (req, res) => {
  try {
    const { productId } = req.params;

    if (!req.session.cart || req.session.cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    const itemIndex = req.session.cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // حذف المنتج من العربة
    req.session.cart.items.splice(itemIndex, 1);

    // إعادة حساب السعر الإجمالي إذا كانت هناك عناصر باقية
    req.session.cart.totalPrice = req.session.cart.items.length > 0 
      ? req.session.cart.items.reduce(
          (total, item) => total + (item.price * item.quantity),
          0
        )
      : 0;

    res.status(200).json({
      message: 'Product removed from cart',
      cart: {
        cart: req.session.cart.items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        totalPrice: req.session.cart.totalPrice
      }
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Error removing product from cart', error: error.message });
  }
};