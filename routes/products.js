const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');  // استيراد middleware لرفع الصور
const ProductController = require('../controllers/productController'); // استيراد ProductController
const isAdmin = require('../middlewares/isAdmin'); // استيراد middleware للتحقق من صلاحية الإدمن

// مسار إضافة منتج جديد (محتاج رفع صورة، وبيكون خاص بالإدمن فقط)
router.post('/',upload.single('image'), ProductController.createProduct);

// مسار عرض كل المنتجات (مسموح للجميع)
router.get('/', ProductController.getAllProducts);

// مسار عرض منتج واحد (مسموح للجميع)
router.get('/:id', ProductController.getProductById);

// مسار تعديل منتج (محتاج رفع صورة جديدة وبيكون خاص بالإدمن فقط)
router.put('/:id', upload.single('image'), ProductController.updateProduct);

// مسار حذف منتج (خاص بالإدمن فقط)
router.delete('/:id',  ProductController.deleteProduct);

module.exports = router;
