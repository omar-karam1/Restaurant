const Product = require('../models/Product');  // استيراد نموذج المنتج

// إنشاء منتج جديد
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const image = req.file ? req.file.filename : null; // تحقق إذا كان هناك صورة مرفوعة

    // إنشاء منتج جديد
    const product = new Product({
      name,
      price,
      description,
      category,
      image
    });

    // حفظ المنتج في قاعدة البيانات
    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });

  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
};

// عرض كل المنتجات
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category'); // نشر فئة المنتج
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// عرض منتج واحد
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category'); // نشر فئة المنتج
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// تعديل منتج
exports.updateProduct = async (req, res) => {
    try {
      const productId = req.params.id;
  
      // التأكد من وجود المنتج
      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        return res.status(404).json({ message: 'المنتج غير موجود' });
      }
  
      // استخراج البيانات الجديدة
      const { name, price, description, category } = req.body;
      const image = req.file ? req.file.filename : existingProduct.image;
  
      // تحديث القيم
      existingProduct.name = name || existingProduct.name;
      existingProduct.price = price || existingProduct.price;
      existingProduct.description = description || existingProduct.description;
      existingProduct.category = category || existingProduct.category;
      existingProduct.image = image;
  
      // حفظ التحديث
      const updatedProduct = await existingProduct.save();
  
      res.status(200).json(updatedProduct);
    } catch (err) {
      console.error('خطأ أثناء تحديث المنتج:', err);
      res.status(500).json({ message: 'حدث خطأ أثناء تحديث المنتج' });
    }
  };

// حذف منتج
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
