const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const isAdmin = require('../middlewares/isAdmin'); // ✅ استدعاء ميدل وير الأدمن

// Create (للأدمن فقط)
router.post('/add',  categoryController.createCategory);

// Read all (متاح للجميع)
router.get('/', categoryController.getAllCategories);

// Read one (متاح للجميع)
router.get('/:id', categoryController.getCategoryById);

// Update (للأدمن فقط)
router.put('/:id', isAdmin, categoryController.updateCategory);

// Delete (للأدمن فقط)
router.delete('/:id', isAdmin, categoryController.deleteCategory);

module.exports = router;
