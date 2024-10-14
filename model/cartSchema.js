const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    }, 
    productCount: {
        type: Number,
        default: 1,
    },
    productPrice: {
        type: Number,
        required: true
    },
    productImage: {
        type: String, // New field for storing the product image
    },
}, { _id: false, timestamps: true });

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to the user's unique ObjectId
        ref: 'echoemporium2',  // Refers to the 'User' collection
        required: true
    },
    items: [itemSchema],
    payableAmount: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('carts', cartSchema);
