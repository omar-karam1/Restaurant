const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // ربط المنتج بالفئة
  image: { type: String ,required:false }  // حفظ اسم الصورة
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);
