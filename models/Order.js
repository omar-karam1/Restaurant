const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    orderItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem', required: true }],
    totalPrice: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Preparing', 'Delivered'], default: 'Pending' },
    paymentMethod: { type: String, enum: ['Cash', 'Credit Card'], default: 'Cash' }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
